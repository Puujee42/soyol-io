'use client';

import { useState, useCallback, useEffect } from 'react';
<<<<<<< HEAD
import { Video, Phone, ArrowLeft, Loader2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { LiveKitRoom } from '@livekit/components-react';
import '@livekit/components-styles';

import { useVideoRoom } from '@/hooks/useVideoRoom';
import ConnectionOverlay from './video-call/ConnectionOverlay';
import RoomEventHandler from './video-call/RoomEventHandler';
import VideoCallRoom from './video-call/VideoCallRoom';
=======
import { Video, Phone, ArrowLeft, Loader2, Ban } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  LiveKitRoom,
  VideoConference,
  RoomAudioRenderer,
  ControlBar,
  useParticipants,
  useRoomContext
} from '@livekit/components-react';
import '@livekit/components-styles';
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255

export interface VideoCallProps {
  prefilledRoom?: string;
  conversationId?: string;
  onBack?: () => void;
  onDisconnected?: () => void;
  initialVideoDisabled?: boolean;
}

export default function VideoCall({ 
  prefilledRoom, 
<<<<<<< HEAD
  conversationId,
=======
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255
  onBack, 
  onDisconnected,
  initialVideoDisabled = false
}: VideoCallProps) {
<<<<<<< HEAD
  const {
    token,
    identity,
    roomName,
    connectionState,
    setConnectionState,
    connectToRoom,
    disconnect,
    isConnecting
  } = useVideoRoom();

  const [inputRoom, setInputRoom] = useState(prefilledRoom || '');
  const [permissionError, setPermissionError] = useState(false);
  const [checkingPermission, setCheckingPermission] = useState(false);
=======
  const [room, setRoom] = useState(prefilledRoom || '');
  const [inCall, setInCall] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [token, setToken] = useState('');
  const [identity, setIdentity] = useState('');

  const connectToRoom = async () => {
    const roomName = room.trim();
    if (!roomName) { toast.error('Өрөөний нэр оруулна уу'); return; }

    setConnecting(true);
    const userIdentity = `user_${Math.floor(Math.random() * 10000)}`;
    setIdentity(userIdentity);
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255

  // Verifies client-side camera/microphone access before handshaking with LiveKit
  const verifyMediaPermissions = useCallback(async (): Promise<boolean> => {
    setCheckingPermission(true);
    try {
<<<<<<< HEAD
      const constraints = {
        video: !initialVideoDisabled,
        audio: true
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      // Clean up stream immediately
      stream.getTracks().forEach(track => track.stop());
      setPermissionError(false);
      return true;
    } catch (err: any) {
      console.error('Media permission request rejected:', err);
      setPermissionError(true);
      toast.error('Камер эсвэл микрофон ашиглах зөвшөөрөл олгоогүй байна.');
      return false;
    } finally {
      setCheckingPermission(false);
    }
  }, [initialVideoDisabled]);

  const handleConnect = useCallback(async (targetRoom: string) => {
    const cleanRoom = targetRoom.trim();
    if (!cleanRoom) {
      toast.error('Өрөөний нэр оруулна уу');
      return;
    }

    const hasPermissions = await verifyMediaPermissions();
    if (!hasPermissions) return;

    const randomIdentity = `user_${Math.floor(Math.random() * 10000)}`;
    try {
      await connectToRoom(cleanRoom, randomIdentity, randomIdentity);
      toast.success('Дуудлага амжилттай холбогдлоо!');
    } catch (err) {
      toast.error('Холболт амжилтгүй. Дахин оролдоно уу.');
    }
  }, [connectToRoom, initialVideoDisabled, verifyMediaPermissions]);

  const onLeave = useCallback(async () => {
    disconnect();
    toast('Дуудлага дууслаа', { icon: '📵' });
    onDisconnected?.();
  }, [disconnect, onDisconnected]);

  // Handle prefilled room from direct message call invitations
  useEffect(() => {
    if (prefilledRoom && !token && connectionState === 'disconnected') {
      setInputRoom(prefilledRoom);
      handleConnect(prefilledRoom);
    }
  }, [prefilledRoom, token, connectionState, handleConnect, verifyMediaPermissions]);

  // If permission is denied, render warning prompt
  if (permissionError) {
    return (
      <div className="h-full flex items-center justify-center p-4 bg-transparent">
        <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-3xl p-6 text-center space-y-4 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-bold text-white">Зөвшөөрөл шаардлагатай</h2>
            <p className="text-xs text-slate-400 leading-relaxed max-w-[280px] mx-auto">
              Видео эсвэл дуут дуудлага хийхэд камер болон микрофон ашиглах зөвшөөрөл шаардлагатай. Вэб хөтчийнхөө тохиргооноос зөвшөөрөл олгоно уу.
            </p>
          </div>
          <button
            onClick={verifyMediaPermissions}
            disabled={checkingPermission}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-600 hover:to-amber-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            {checkingPermission ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              'Зөвшөөрөл шалгах'
            )}
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors block w-full text-center"
            >
              Буцах
            </button>
          )}
        </div>
=======
      const res = await fetch(`/api/livekit?room=${encodeURIComponent(roomName)}&username=${encodeURIComponent(userIdentity)}`);
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      setToken(data.token);
      setInCall(true);
      toast.success('Дуудлагад нэгдлээ!');
    } catch (err) {
      toast.error('Холбогдож чадсангүй. Дахин оролдоно уу.');
    } finally {
      setConnecting(false);
    }
  };

  const onLeave = useCallback(async () => {
    setInCall(false);
    setToken('');
    toast('Дуудлага дууслаа', { icon: '📵' });
    onDisconnected?.();
  }, [onDisconnected]);

  // If we have token and we are in call
  if (inCall && token) {
    return (
      <div className="relative h-full w-full bg-black overflow-hidden rounded-[2.5rem]">
        <LiveKitRoom
          video={!initialVideoDisabled}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={onLeave}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Default UI with custom top bar to show Room name / Kick capability */}
          <VideoConference />
          <RoomAudioRenderer />
          
          {/* Custom Overlay for Ban Feature */}
          <BanControls currentRoom={room} currentIdentity={identity} />
          
        </LiveKitRoom>
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255
      </div>
    );
  }

<<<<<<< HEAD
  // Render Call Room
  if (token) {
    return (
      <div className="relative h-full w-full bg-black overflow-hidden rounded-[2.5rem]">
        <LiveKitRoom
          video={!initialVideoDisabled}
          audio={true}
          token={token}
          serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
          data-lk-theme="default"
          onDisconnected={onLeave}
          style={{ height: '100%', width: '100%', position: 'relative' }}
        >
          {/* Synchronize LiveKit room states back into local state */}
          <RoomEventHandler
            onDisconnected={onLeave}
            onReconnecting={() => setConnectionState('reconnecting')}
            onReconnected={() => setConnectionState('connected')}
          />

          {/* Connection overlays */}
          {(connectionState === 'connecting' || connectionState === 'reconnecting' || connectionState === 'failed') && (
            <ConnectionOverlay
              state={connectionState}
              onRetry={connectionState === 'failed' ? () => handleConnect(roomName) : undefined}
            />
          )}

          <VideoCallRoom
            roomId={roomName}
            conversationId={conversationId}
            identity={identity}
            onLeave={onLeave}
          />
        </LiveKitRoom>
      </div>
    );
  }

=======
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255
  // Pre-call UI
  return (
    <div className="h-full flex items-center justify-center p-4 bg-transparent">
      <div className="w-full max-w-sm">
        {onBack && (
          <button
            onClick={onBack}
            className="mb-4 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Буцах</span>
          </button>
        )}
        <div className="text-center mb-8">
<<<<<<< HEAD
          <div className="w-16 h-16 bg-orange-100/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-500/20">
=======
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255
            {initialVideoDisabled ? (
              <Phone className="w-8 h-8 text-orange-500" />
            ) : (
              <Video className="w-8 h-8 text-orange-500" />
            )}
          </div>
          <h1 className="text-xl font-bold text-white mb-1">
            {initialVideoDisabled ? 'Дуут дуудлага' : 'Видео дуудлага'}
          </h1>
          <p className="text-slate-400 text-sm">Өрөөний нэр оруулж дуудлага эхлүүлнэ үү</p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-md rounded-3xl border border-white/10 p-6 shadow-xl space-y-4">
           <div>
            <label htmlFor="room-input" className="block text-xs font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Өрөөний нэр
            </label>
            <input
              id="room-input"
              type="text"
              value={inputRoom}
              onChange={e => setInputRoom(e.target.value)}
              placeholder="my-room-123"
              className="w-full px-4 py-3 bg-slate-900/50 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all outline-none text-base"
            />
            <p className="mt-2 text-[10px] text-slate-500">Нөгөө хүнтэйгээ адил нэр ашиглана уу</p>
          </div>

          <button
<<<<<<< HEAD
            onClick={() => handleConnect(inputRoom)}
            disabled={isConnecting || checkingPermission || !inputRoom.trim()}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {isConnecting || checkingPermission ? (
=======
            onClick={connectToRoom}
            disabled={connecting || !room.trim()}
            className="w-full py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            {connecting ? (
>>>>>>> f496bf203b987aa35b4840ff338977bb9636d255
              <><Loader2 className="w-5 h-5 animate-spin" /><span>Холбогдож байна...</span></>
            ) : (
              <><Phone className="w-5 h-5" /><span>Дуудлагад орох</span></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// Subcomponent to handle kicking users
function BanControls({ currentRoom, currentIdentity }: { currentRoom: string, currentIdentity: string }) {
  const participants = useParticipants();
  
  // Exclude ourselves
  const others = participants.filter(p => p.identity !== currentIdentity);

  const handleKick = async (identity: string) => {
    try {
      const res = await fetch('/api/livekit/ban', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomName: currentRoom, identity }),
      });
      const data = await res.json();
      if (data.success) {
         toast.success("Хэрэглэгчийг гаргалаа");
      } else {
         toast.error("Алдаа гарлаа: " + data.error);
      }
    } catch (e) {
      toast.error("Гаргах хүсэлт амжилтгүй боллоо");
    }
  };

  return (
    <div className="absolute top-2 left-2 right-2 z-50 flex flex-col gap-2">
       <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10">
        <span className="text-white text-[10px] font-semibold flex items-center gap-2 truncate">
            Өрөө: {currentRoom}
        </span>
      </div>
      
      {others.length > 0 && (
        <div className="bg-black/60 backdrop-blur-md p-3 rounded-xl border border-white/20 mt-2">
            <h3 className="text-xs text-white/70 mb-2 uppercase font-semibold">Оролцогчид</h3>
            <div className="flex flex-col gap-2">
                {others.map(p => (
                    <div key={p.identity} className="flex items-center justify-between gap-4 text-white text-sm">
                        <span>{p.identity}</span>
                        <button 
                            onClick={() => handleKick(p.identity)}
                            title="Гаргах (Ban)"
                            className="p-1.5 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
                        >
                            <Ban className="w-4 h-4 text-white" />
                        </button>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
}
