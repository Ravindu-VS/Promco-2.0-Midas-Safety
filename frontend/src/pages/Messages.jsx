import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Button, Card, CardContent, Chip, TextField } from '@mui/material';
import { formatDateTime, messagesApi } from '../services/api';
import { errorMessage, getCurrentUser } from '../services/authService';
import './Messages.css';

/** Non-admins send messages to the admins and see the replies; admins answer them. */
const Messages = () => {
  const isAdmin = getCurrentUser()?.role === 'admin';
  const [messages, setMessages] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [replies, setReplies] = useState({});
  const [status, setStatus] = useState(null);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async () => {
    try {
      setMessages(await messagesApi.list());
      setLoadError('');
    } catch (e) {
      setLoadError(errorMessage(e, 'Could not load messages'));
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const send = async (e) => {
    e.preventDefault();
    if (!body.trim()) return setStatus({ severity: 'error', message: 'Write a message first' });
    try {
      await messagesApi.send({ subject, body });
      setSubject('');
      setBody('');
      setStatus({ severity: 'success', message: 'Message sent. The admins have been notified.' });
      load();
    } catch (err) {
      setStatus({ severity: 'error', message: errorMessage(err, 'Could not send the message') });
    }
  };

  const resolve = async (m) => {
    try {
      await messagesApi.resolve(m.id, replies[m.id] || '');
      setReplies((prev) => ({ ...prev, [m.id]: '' }));
      load();
    } catch (err) {
      setStatus({ severity: 'error', message: errorMessage(err, 'Could not resolve the message') });
    }
  };

  return (
    <div className="messages-page">
      <h2 className="page-title">{isAdmin ? 'Messages from users' : 'Contact Admin'}</h2>
      {loadError && <Alert severity="error" sx={{ mb: 2 }}>{loadError}</Alert>}
      {status && <Alert severity={status.severity} sx={{ mb: 2 }} onClose={() => setStatus(null)}>{status.message}</Alert>}

      {!isAdmin && (
        <Card className="message-card" component="form" onSubmit={send}>
          <CardContent>
            <TextField label="Subject" fullWidth margin="dense" value={subject} onChange={(e) => setSubject(e.target.value)} />
            <TextField label="Message" required fullWidth margin="dense" multiline minRows={4} value={body}
              onChange={(e) => setBody(e.target.value)} inputProps={{ maxLength: 2000 }} />
            <Button type="submit" variant="contained" color="error" sx={{ mt: 1 }}>Send to Admin</Button>
          </CardContent>
        </Card>
      )}

      <h3 className="messages-heading">{isAdmin ? 'Inbox' : 'Your messages'}</h3>
      {messages.length === 0 && !loadError && <p className="messages-empty">No messages yet.</p>}
      {messages.map((m) => (
        <Card key={m.id} className="message-card">
          <CardContent>
            <div className="message-head">
              <strong>{m.subject}</strong>
              <Chip size="small" label={m.status} color={m.status === 'Resolved' ? 'success' : 'warning'} />
            </div>
            <div className="message-meta">{isAdmin ? `From ${m.fromUsername} · ` : ''}{formatDateTime(m.createdAt)}</div>
            <p className="message-body">{m.body}</p>
            {m.status === 'Resolved' && (
              <div className="message-reply">
                <b>{m.resolvedByName}</b> · {formatDateTime(m.resolvedAt)}
                <div>{m.reply || 'Marked as resolved.'}</div>
              </div>
            )}
            {isAdmin && m.status !== 'Resolved' && (
              <div>
                <TextField label="Reply (optional)" fullWidth margin="dense" multiline minRows={2} value={replies[m.id] || ''}
                  onChange={(e) => setReplies((prev) => ({ ...prev, [m.id]: e.target.value }))} />
                <Button variant="contained" color="error" size="small" onClick={() => resolve(m)}>Reply &amp; resolve</Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default Messages;
