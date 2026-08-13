import { Client } from '@stomp/stompjs';
import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import type { IconType } from 'react-icons';
import { FiArrowLeft, FiMoreVertical, FiSend } from 'react-icons/fi';
import { Link, useNavigate, useParams, useRevalidator } from 'react-router-dom';
import { CLEAN_URL } from '../features/api/baseUrl';
import { useLazyGetMatchQuery, useRemoveLikeMutation } from '../features/api/transApi';
import { useCreateMessageNotifMutation, useLazyGetMessagesQuery, useMarkNotifAsReadMutation } from '../features/api/userApi';
import { useAppSelector } from '../store';
import type { TLikes } from '../types/TLikes';
import type { TMessages } from '../types/TMessages';
import { formatLastSentDate, MOMENT_OPTIONS, sanitizeBackendKey } from '../util/util';
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
  hasMatchRequest:false,
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


  console.log(matchUser);
  
  // 1. Guard check for missing route parameters


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
      if(res.data===null)   navigate('/landing/messages');
      
      if (res.data) setMatchUser(res.data as TLikes);
    }

    getMyMatch(parseInt(matchId), currentUserId);
  }, [matchId, currentUserId, getMatch]);

  // 5. FIXED: WebSocket Lifecycle Manager (No ghost connections/leaks)
  /*
  useEffect(() => {
    if (!matchId) return;

    const savedToken = localStorage.getItem("tk");
    const stompClient = new Client({
      brokerURL: `wss://${CLEAN_URL}/ws?token=${savedToken}`,
      onConnect: () => {
        stompClient.subscribe(`/topic/chat/${matchId}`, (messageOutput) => {              
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
  */

  useEffect(() => {
  if (!matchId) return;

  const savedToken = localStorage.getItem("tk");
  
  // 1. Keep the connection string short and clean
  const socketUrl = `ws://${CLEAN_URL}/ws`;

  const stompClient = new Client({
    brokerURL: socketUrl,
    
    // 2. Safely deliver your long JWT token through connection headers instead of URL parameters
    connectHeaders: {
      Authorization: `Bearer ${savedToken}`
    },

    // 3. Keep-alive pings every 10 seconds prevent Railway from killing the connection
    heartbeatIncoming: 10000,
    heartbeatOutgoing: 10000,
    reconnectDelay: 5000, // Automatically reconstructs the tunnel if it drops

    onConnect: () => {
      console.log(`Successfully connected to match topic: ${matchId}`);
      
      stompClient.subscribe(`/topic/messages/${matchId}`, (messageOutput) => {              
        const incomingMessage = JSON.parse(messageOutput.body);
        
        // 4. Using functional updates prevents stale state closures
        setMessages((prev) => {
          // Safety check: Don't append duplicate messages if the socket sends them twice
          if (prev.some(msg => msg.id === incomingMessage.id)) return prev;
          return [...prev, incomingMessage];
        });
      });
    },
    onStompError: (frame) => {
      console.error('STOMP layer error profile:', frame);
    },
    onWebSocketClose: () => {
      console.warn("WebSocket closed. Attempting auto-reconnect...");
    }
  });

  stompClient.activate();
  stompClientRef.current = stompClient;

  return () => {
    if (stompClientRef.current) {
      console.log("Cleaning up WebSocket client connection...");
      stompClientRef.current.deactivate();
      stompClientRef.current = null;
    }
  };
}, [matchId]); // Safely handles shifting chat rooms dynamically


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
      console.log(response.data);
      
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


    //translation hook
    const {t} = useTranslation();

    
  return (
    <section className="chatroom">
      <section className="chatWindow">
      
        <header>
           <div className='return-link'>
             <Link to={'/landing/messages'} >
          <FiArrowLeft/>
        </Link>
           </div>
          <div className="user">
            <div className="avatar">
              <Link to={`/landing/view/?id=${partnerId}`}>
                <img src={matchUser.image || defImage} alt={matchUser.firstName} /> 
              </Link>       
            </div>
            <div className='name-container'>
              <h3>{`${matchUser.firstName}`}</h3>
              <div className='status-container'>
                <div className='status'>
                  <div className={`${matchUser.online ? 'active' : 'not-active'}`}></div>
                  <span>{matchUser.online ? t('Chatroom.status.online'): t('Chatroom.status.offline')}</span>
                </div>
                {matchUser.activity && (
                  <div className="system-context-icebreaker">
                    {/* FIXED: Changed to lowercase prop definition */}
                    <span>{t('Chatroom.header.connected_via')} <ReactIcon icon={MOMENT_OPTIONS.find((moment) => moment.label === matchUser.activity)?.icon as IconType}/> 
                      {t(`Moments.${sanitizeBackendKey(matchUser.activity)}`)}</span>
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
              <button className="btn" onClick={handleUnmatchUser}>{t('Chatroom.menu.unmatch')}</button>
              <Link to={`/landing/view/${partnerId}`} className="btn">{t('Chatroom.menu.view_profile')}</Link>
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
                    <span>{formatLastSentDate(message.createdAt as Date)}</span>
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
              placeholder={t('Chatroom.footer.input_placeholder',{name:matchUser.firstName||''})} 
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

