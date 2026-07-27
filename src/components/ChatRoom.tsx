import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import type { IconType } from 'react-icons';
import { FiMoreVertical, FiSend } from 'react-icons/fi';
import { Link, useNavigate, useParams, useRevalidator } from 'react-router-dom';
import { CLEAN_URL } from '../features/api/baseUrl';
import { useLazyGetMatchQuery, useRemoveLikeMutation } from '../features/api/transApi';
import { useCreateMessageNotifMutation, useLazyGetMessagesQuery, useMarkNotifAsReadMutation } from '../features/api/userApi';
import { useAppSelector } from '../store';
import type { TLikes } from '../types/TLikes';
import type { TMessages } from '../types/TMessages';
import { getDaysFromNow, MOMENT_OPTIONS } from '../util/util';
import defImage from './../assets/default.jpeg';
import './../css/ChatRoom.css';
import ReactIcon from './ReactIcon';
const defUser:TLikes={
  firstName: '',
  lastName: '',
  date_of_birth: '',
  city: '',
  image: defImage,
  senderId: 0,
  receiverId: 0,
  matchId: -1,
  lastMessageDate: new Date(),
  lastMessage: '',
  hasUnreadMessage:false,
  online: false,
  activity:'',
  requestDate: new Date(),
}


const ChatRoom = () => {
  const [messages, setMessages] = useState<TMessages[]>([]);
  const [input, setInput] = useState<string>('');
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const currentUserId = useAppSelector((state) => state.userSlice.id);
  const { matchId } = useParams();
  const { revalidate } = useRevalidator();
  const navigate = useNavigate();

  const [matchUser, setMatchUser] = useState<TLikes>(defUser);
  
  const stompClientRef = useRef<Client | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [updateNotif] = useMarkNotifAsReadMutation();
  const [createNotif] = useCreateMessageNotifMutation();
  const [getMatch] = useLazyGetMatchQuery();
  const [getMessage] = useLazyGetMessagesQuery();
  const [unmatch] = useRemoveLikeMutation();

  // Determine chat target partner cleanly
  const partnerId = matchUser.senderId === currentUserId ? matchUser.receiverId : matchUser.senderId;

  // 1. Guard check for missing route parameters
  useEffect(() => {
    if (!matchId) {
      navigate('/landing/messages');
    }
  }, [matchId, navigate]);

  // 2. Auto-scroll window to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 3. Sync Historical message archives
  useEffect(() => {
    if (!matchId) return;

    async function getMyMessages(id: number) {
      const res = await getMessage(id);
      if (res.data) setMessages(res.data as TMessages[]);
    }
    
    getMyMessages(parseInt(matchId));
  }, [matchId, getMessage]);

  // 4. Fetch profile header metadata updates
  useEffect(() => {
    if (!matchId) return;

    async function getMyMatch(mId: number, cId: number) {
      const res = await getMatch({ matchId: mId, currentUserId: cId });
      if (res.data) setMatchUser(res.data as TLikes);
    }

    getMyMatch(parseInt(matchId), currentUserId);
  }, [matchId, currentUserId, getMatch]);

  // 5. FIXED: WebSocket Lifecycle Manager (No ghost connections/leaks)
  useEffect(() => {
    if (!matchId) return;

    const savedToken = localStorage.getItem("tk");
    const stompClient = new Client({
      brokerURL: `ws://${CLEAN_URL}/ws?token=${savedToken}`,
      onConnect: () => {
        stompClient.subscribe(`/topic/messages/${matchId}`, (messageOutput) => {              
          const incomingMessage = JSON.parse(messageOutput.body);
          setMessages((prev) => [...prev, incomingMessage]);
        });
      },
      onStompError: (frame) => {
        console.error('STOMP layer error profile:', frame);
      }
    });

    stompClientRef.current = stompClient;
    stompClient.activate();

    // Correctly returned cleanup function to hook lifecycle
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
        stompClientRef.current = null;
      }
    };
  }, [matchId]);

  // 6. Handle Outbound Messages
  const handleMessageSend = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!input.trim() || !stompClientRef.current?.connected) {
      console.warn("Cannot send message: WebSocket is disconnected or input is empty.");
      return;
    }

    // FIXED: Correctly targeted dynamically calculated partnerId
    const messagePayload: TMessages = {
      receiverId: partnerId,
      senderId: currentUserId,
      message: input.trim(),
      matchId: parseInt(matchId as string),
    };

    stompClientRef.current.publish({
      destination: `/app/chat/${matchId}`,
      body: JSON.stringify(messagePayload)
    });

    setInput('');
  
    createNotif({ 
      sender: currentUserId, 
      receiver: partnerId, 
      targetId: parseInt(matchId as string) 
    });
  };

  const handleShowMenuList = () => {
    setShowMenu(prev => !prev);
  };

  const handleUnmatchUser = async () => {
    try {
      const response = await unmatch(matchUser.matchId);
      if (response.data) {
        revalidate();
        navigate('/landing/messages');
      }
    } catch (error) {
      console.error("Failed to unmatch user:", error);
    }
  };
      
  const handleInputFocus = async () => {
    if (matchId) {
      await updateNotif({ targetId: parseInt(matchId), type: 'message', recipient: currentUserId });
    }
  };

  return (
    <section className="chatroom">
      <section className="chatWindow">
        
        <header>
          <div className="user">
            <div className="avatar">
              <Link to={`/landing/view/${partnerId}`}>
                <img src={matchUser.image || defImage} alt={matchUser.firstName} /> 
              </Link>       
            </div>
            <div className='name-container'>
              <h3>{`${matchUser.firstName} ${matchUser.lastName}`}</h3>
              <div className='status-container'>
                <div className='status'>
                  <div className={`${matchUser.online ? 'active' : 'not-active'}`}></div>
                  <span>{matchUser.online ? 'Online' : 'offline'}</span>
                </div>
                {matchUser.activity && (
                  <div className="system-context-icebreaker">
                    {/* FIXED: Changed to lowercase prop definition */}
                    <span>Connected via <ReactIcon icon={MOMENT_OPTIONS.find((moment) => moment.label === matchUser.activity)?.icon as IconType}/> {matchUser.activity} moment</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="menu-container">
            <button className='menu-btn' onClick={handleShowMenuList}>
              <FiMoreVertical size={22} />
            </button>
            <div className="action-buttons" style={{ display: showMenu ? 'flex' : 'none' }}>
              <button className="btn" onClick={handleUnmatchUser}>Unmatch</button>
              <Link to={`/landing/view/${partnerId}`} className="btn">View profile</Link>
            </div>
          </div>
        </header>

        <div className="chat-messages-container">
          <div className="chat-messages">
            {messages.map((message) => {
              const isMine = message.senderId === currentUserId;
              return (
                <div key={message.id} className={`message ${isMine ? 'mine' : ''}`}>
                  <div className="bubble">
                    {message.message}
                    <span>{getDaysFromNow ? getDaysFromNow(message.createdAt as Date) : 'Just now'}</span>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        </div>

        <footer className='message-footer'>
          <form onSubmit={handleMessageSend} className='message-form'>
            <input 
              placeholder={`Message ${matchUser.firstName || ''}`} 
              value={input} 
              onChange={(e) => setInput(e.target.value)} 
              onFocus={handleInputFocus}
            />
            <button type="submit">
              <FiSend size={18} />
            </button>
          </form>
        </footer>

      </section>
    </section>
  );
};

export default ChatRoom;

