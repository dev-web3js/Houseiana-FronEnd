"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function MessagesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const messageInputRef = useRef(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Fetch conversations
  const fetchConversations = async () => {
    if (!user) return;

    setLoadingConversations(true);
    try {
      const response = await fetch('/api/messages/conversations', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setConversations(data.conversations || []);
        
        // Auto-select first conversation if none selected
        if (data.conversations.length > 0 && !selectedConversation) {
          setSelectedConversation(data.conversations[0]);
        }
      } else {
        console.error('Failed to fetch conversations');
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoadingConversations(false);
    }
  };

  // Fetch messages for selected conversation
  const fetchMessages = async (conversationId) => {
    if (!conversationId) return;

    setLoadingMessages(true);
    try {
      const response = await fetch(`/api/messages/${conversationId}`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
        scrollToBottom();
      } else {
        console.error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || sending) return;

    setSending(true);
    const messageContent = newMessage;
    setNewMessage('');

    try {
      const response = await fetch(`/api/messages/${selectedConversation.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ content: messageContent })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
        scrollToBottom();
        
        // Update conversation's last message
        setConversations(prev => prev.map(conv => 
          conv.id === selectedConversation.id 
            ? { ...conv, lastMessage: data.message, lastMessageAt: data.message.createdAt }
            : conv
        ));
      } else {
        // Restore message if send failed
        setNewMessage(messageContent);
        alert('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setNewMessage(messageContent);
      alert('Failed to send message');
    } finally {
      setSending(false);
      messageInputRef.current?.focus();
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  // Load conversations on mount
  useEffect(() => {
    fetchConversations();
  }, [user]);

  // Load messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  // Auto-refresh conversations every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchConversations();
    }, 30000);

    return () => clearInterval(interval);
  }, [user]);

  if (loading || loadingConversations) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f7f7f7'
      }}>
        <div style={{ fontSize: '18px', color: '#717171' }}>Loading messages...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f7f7f7',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <header style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        padding: '16px 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          gap: '24px'
        }}>
          <Link href="/dashboard" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
            color: '#222'
          }}>
            <span>←</span>
            <span style={{ fontSize: '16px', fontWeight: '500' }}>Back</span>
          </Link>
          
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600'
          }}>
            Messages
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <div style={{
        flex: 1,
        maxWidth: '1400px',
        width: '100%',
        margin: '0 auto',
        padding: '24px',
        display: 'flex',
        gap: '24px',
        height: 'calc(100vh - 80px)'
      }}>
        {/* Conversations List */}
        <div style={{
          width: '350px',
          backgroundColor: 'white',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #e0e0e0'
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: '600' }}>All Conversations</h2>
          </div>
          
          <div style={{
            flex: 1,
            overflowY: 'auto'
          }}>
            {conversations.length > 0 ? (
              conversations.map(conv => (
                <div
                  key={conv.id}
                  onClick={() => setSelectedConversation(conv)}
                  style={{
                    padding: '16px 20px',
                    borderBottom: '1px solid #f0f0f0',
                    cursor: 'pointer',
                    backgroundColor: selectedConversation?.id === conv.id ? '#f8fafc' : 'white',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedConversation?.id !== conv.id) {
                      e.currentTarget.style.backgroundColor = '#fafafa';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedConversation?.id !== conv.id) {
                      e.currentTarget.style.backgroundColor = 'white';
                    }
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      backgroundColor: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#717171'
                    }}>
                      {conv.otherParticipant.profileImage ? (
                        <img 
                          src={conv.otherParticipant.profileImage} 
                          alt={conv.otherParticipant.name}
                          style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            objectFit: 'cover'
                          }}
                        />
                      ) : (
                        conv.otherParticipant.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px'
                      }}>
                        <div style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          {conv.otherParticipant.name}
                          {conv.otherParticipant.isHost && (
                            <span style={{
                              padding: '2px 6px',
                              backgroundColor: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '500'
                            }}>
                              HOST
                            </span>
                          )}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span style={{
                            padding: '2px 8px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            borderRadius: '10px',
                            fontSize: '11px',
                            fontWeight: '600',
                            minWidth: '20px',
                            textAlign: 'center'
                          }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                      
                      {conv.listing && (
                        <div style={{
                          fontSize: '12px',
                          color: '#6b7280',
                          marginBottom: '4px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.listing.title}
                        </div>
                      )}
                      
                      {conv.lastMessage && (
                        <div style={{
                          fontSize: '13px',
                          color: '#9ca3af',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {conv.lastMessage.senderId === user?.id ? 'You: ' : ''}
                          {conv.lastMessage.content}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '40px 20px',
                textAlign: 'center',
                color: '#6b7280'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>No conversations yet</div>
                <div style={{ fontSize: '14px', marginTop: '8px' }}>
                  Start a conversation with a host or guest
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
            {/* Chat Header */}
            <div style={{
              padding: '20px',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: '#fafafa'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#717171'
                }}>
                  {selectedConversation.otherParticipant.profileImage ? (
                    <img 
                      src={selectedConversation.otherParticipant.profileImage} 
                      alt={selectedConversation.otherParticipant.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    selectedConversation.otherParticipant.name.charAt(0).toUpperCase()
                  )}
                </div>
                
                <div>
                  <div style={{
                    fontWeight: '600',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    {selectedConversation.otherParticipant.name}
                    {selectedConversation.otherParticipant.isHost && (
                      <span style={{
                        padding: '2px 8px',
                        backgroundColor: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        HOST
                      </span>
                    )}
                  </div>
                  {selectedConversation.listing && (
                    <div style={{
                      fontSize: '13px',
                      color: '#6b7280'
                    }}>
                      {selectedConversation.listing.title}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Messages Area */}
            <div style={{
              flex: 1,
              padding: '20px',
              overflowY: 'auto',
              backgroundColor: '#fafafa'
            }}>
              {loadingMessages ? (
                <div style={{ textAlign: 'center', color: '#6b7280' }}>
                  Loading messages...
                </div>
              ) : messages.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      style={{
                        display: 'flex',
                        justifyContent: msg.isOwn ? 'flex-end' : 'flex-start'
                      }}
                    >
                      <div style={{
                        maxWidth: '70%',
                        padding: '12px 16px',
                        borderRadius: msg.isOwn ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        backgroundColor: msg.isOwn ? '#2563eb' : 'white',
                        color: msg.isOwn ? 'white' : '#1f2937',
                        boxShadow: !msg.isOwn ? '0 1px 2px rgba(0,0,0,0.1)' : 'none'
                      }}>
                        <div style={{ wordBreak: 'break-word' }}>
                          {msg.content}
                        </div>
                        <div style={{
                          fontSize: '11px',
                          color: msg.isOwn ? 'rgba(255,255,255,0.7)' : '#9ca3af',
                          marginTop: '4px'
                        }}>
                          {new Date(msg.createdAt).toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                          {msg.isOwn && msg.isRead && ' • Read'}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  color: '#6b7280',
                  marginTop: '40px'
                }}>
                  <div style={{ fontSize: '14px' }}>No messages yet</div>
                  <div style={{ fontSize: '13px', marginTop: '8px' }}>
                    Send a message to start the conversation
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={sendMessage} style={{
              padding: '20px',
              borderTop: '1px solid #e0e0e0',
              backgroundColor: 'white'
            }}>
              <div style={{
                display: 'flex',
                gap: '12px'
              }}>
                <input
                  ref={messageInputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  disabled={sending}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '24px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: newMessage.trim() && !sending ? '#2563eb' : '#e0e0e0',
                    color: newMessage.trim() && !sending ? 'white' : '#9ca3af',
                    border: 'none',
                    borderRadius: '24px',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: newMessage.trim() && !sending ? 'pointer' : 'not-allowed'
                  }}
                >
                  {sending ? 'Sending...' : 'Send'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div style={{
            flex: 1,
            backgroundColor: 'white',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6b7280'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>💬</div>
              <div style={{ fontSize: '18px', fontWeight: '500' }}>Select a conversation</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>
                Choose a conversation from the list to start messaging
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}