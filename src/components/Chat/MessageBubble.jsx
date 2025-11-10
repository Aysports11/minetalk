export default function MessageBubble({ message, isMine }) {
  return (
    <div style={{ display: 'flex', justifyContent: isMine ? 'flex-end' : 'flex-start' }}>
      <div className={isMine ? 'message-mine' : 'message-other'}>
        <p>{message.content}</p>
        <p className="message-time">
          {new Date(message.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
}