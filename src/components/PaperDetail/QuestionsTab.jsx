import { MessageCircle, Send, Quote, Loader2 } from 'lucide-react';

export default function QuestionsTab({ chatMessages, chatInput, isChatLoading, chatEndRef, onInputChange, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isChatLoading) return;
    onSubmit(chatInput.trim());
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {chatMessages.length === 0 && (
          <div className="chat-empty">
            <MessageCircle size={48} />
            <p>Ask questions about this paper</p>
            <span>Answers will include citations to specific sentences</span>
          </div>
        )}
        {chatMessages.map((msg, idx) => (
          <div key={idx} className={`chat-message ${msg.role}`}>
            {msg.role === 'assistant' ? (
              <div className="message-content">
                {msg.content.split(/(\[Citation \d+\]:.*?)(?=\[Citation|\n\n|$)/g).map((part, i) => {
                  if (part.startsWith('[Citation')) {
                    return (
                      <div key={i} className="citation">
                        <Quote size={12} />
                        {part}
                      </div>
                    );
                  }
                  return <span key={i}>{part}</span>;
                })}
              </div>
            ) : (
              <div className="message-content">{msg.content}</div>
            )}
          </div>
        ))}
        {isChatLoading && (
          <div className="chat-message assistant">
            <div className="message-content loading">
              <Loader2 className="spin" size={16} />
              Analyzing paper...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
      <form className="chat-input-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ask a question about this paper..."
          value={chatInput}
          onChange={e => onInputChange(e.target.value)}
          disabled={isChatLoading}
        />
        <button type="submit" disabled={!chatInput.trim() || isChatLoading}>
          <Send size={18} />
        </button>
      </form>
    </div>
  );
}
