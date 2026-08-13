import { FiCheckCircle, FiHeart } from 'react-icons/fi';
import { GoBlocked } from 'react-icons/go';
import { LuMessageCircle } from 'react-icons/lu';
import { Link } from 'react-router-dom';
import './../css/NotificationToast.css';

const NotificationToast = ({message,type}:{message:string,type:string}) => {
 
  // Resolves the context icon helper out of the current type strings variable

  const renderIcon = () => {
    switch (type.toLowerCase()) {
      case 'like':
        return <FiHeart className="toast-icon-svg animate-pulse" fill="currentColor" />;
      case 'message':
        return <LuMessageCircle className="toast-icon-svg" />;
      case 'accepted':
        return <FiCheckCircle className="toast-icon-svg" />;
          case 'blocked':
        return <GoBlocked className="toast-icon-svg" />;
      default:
        return null;
    }
  };


  return (
      <section className="notification-toast">

                            <div className="notification-card">

                                <span className="notification-icon">{renderIcon()}</span>

                                <h2>Share one <strong>Public Moment</strong></h2>

                                {message &&  <p>
                                    {message}
                                </p>}
                               {type==='blocked' &&<Link to={'/landing/create-moment'}>Add moment</Link>}
                            </div>

   </section>
  );
};

export default NotificationToast;
