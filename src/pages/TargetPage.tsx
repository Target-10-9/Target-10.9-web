// TargetPage.tsx
import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { PrivateHeader } from '../components/PrivateHeader';
import { addPoint } from '../features/points/pointsAPI';
import { getSessionById } from '../features/sessions/sessionsAPI';
import { timeStringToSeconds, formatSeconds } from '../utils/timeUtils';
import { SessionEndModal } from '../components/SessionEndModal.tsx';
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MAX_RADIUS = 1.0;
const RING_COUNT = 10;
const RING_WIDTH = MAX_RADIUS / RING_COUNT;

function colorForScore(score: number) {
    if (score >= 9) return '#ffff00';
    if (score >= 7) return '#ff0000';
    if (score >= 5) return '#0000ff';
    if (score >= 3) return '#000000';
    return '#ffffff';
}

const rings = Array.from({ length: RING_COUNT }).map((_, i) => {
    const outer = MAX_RADIUS - i * RING_WIDTH;
    const inner = Math.max(0, outer - RING_WIDTH);
    const score = i + 1;
    return { radiusOuter: outer, radiusInner: inner, color: colorForScore(score), score };
});

function TargetRings({ onHit }: { onHit: (e: any) => void }) {
    return (
        <group>
            {rings.map((r, i) => (
                <mesh key={i} onPointerDown={onHit} position={[0, 0, i * 0.0005]}>
                    <ringGeometry args={[r.radiusInner, r.radiusOuter, 64]} />
                    <meshBasicMaterial color={r.color} side={THREE.DoubleSide} />
                </mesh>
            ))}
        </group>
    );
}

function Cross({ position, size = 0.06 }: { position: THREE.Vector3; size?: number }) {
    const thickness = size * 0.08;
    const z = position.z + 0.02;
    return (
        <group position={[position.x, position.y, z]}>
            <mesh>
                <boxGeometry args={[size, thickness, thickness]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <boxGeometry args={[size, thickness, thickness]} />
                <meshStandardMaterial color="red" />
            </mesh>
        </group>
    );
}

function TimerControl({
                          label,
                          timer,
                      }: {
    label: string;
    timer: ReturnType<typeof useManualCountdown>;
}) {// simple placeholder

    return (
        <div style={{ display: 'flex', alignItems: 'center', marginTop: 12, gap: 12 }}>
            <div style={{ width: 60, height: 60 }}>
                <CircularProgressbar
                    value={timer.seconds}
                    maxValue={timer.seconds || 1}
                    text={formatSeconds(timer.seconds)}
                    styles={buildStyles({
                        textSize: '28px',
                        pathColor: timer.running ? '#4ade80' : '#d1d5db',
                        textColor: '#111827',
                        trailColor: '#e5e7eb',
                    })}
                />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                <strong>{label}</strong>
                <div style={{ display: 'flex', gap: 6 }}>
                    <button
                        onClick={timer.start}
                        disabled={timer.running}
                        style={{
                            background: '#4ade80',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: 4,
                            cursor: timer.running ? 'not-allowed' : 'pointer',
                            color: '#fff',
                        }}
                    >
                        <FaPlay />
                    </button>
                    <button
                        onClick={timer.stop}
                        disabled={!timer.running}
                        style={{
                            background: '#f87171',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: 4,
                            cursor: !timer.running ? 'not-allowed' : 'pointer',
                            color: '#fff',
                        }}
                    >
                        <FaStop />
                    </button>
                    <button
                        onClick={() => timer.reset()}
                        style={{
                            background: '#60a5fa',
                            border: 'none',
                            padding: '6px 10px',
                            borderRadius: 4,
                            cursor: 'pointer',
                            color: '#fff',
                        }}
                    >
                        <FaRedo />
                    </button>
                </div>
            </div>
        </div>
    );
}

function useManualCountdown(initialSeconds: number) {
    const [seconds, setSeconds] = useState(initialSeconds);
    const [running, setRunning] = useState(false);

    useEffect(() => {
        if (!running || seconds <= 0) return;
        const interval = setInterval(() => setSeconds(prev => (prev > 0 ? prev - 1 : 0)), 1000);
        return () => clearInterval(interval);
    }, [running, seconds]);

    const start = () => setRunning(true);
    const stop = () => setRunning(false);
    const reset = (newSec?: number) => {
        setSeconds(newSec ?? initialSeconds);
        setRunning(false);
    };

    return { seconds, start, stop, reset, running };
}

type TargetPageProps = { sessionId: string };

export const TargetPage: React.FC<TargetPageProps> = ({ sessionId }) => {
    const [hits, setHits] = useState<THREE.Vector3[]>([]);
    const [scoreTotal, setScoreTotal] = useState(0);
    const [session, setSession] = useState<any>(null);
    const [shotsFired, setShotsFired] = useState(0);
    const [sessionTimer, setSessionTimer] = useState<number | null>(null);

    const warmup = useManualCountdown(0);
    const shooting = useManualCountdown(0);
    const rest = useManualCountdown(0);

    const [showEndModal, setShowEndModal] = useState(false);

    useEffect(() => {
        getSessionById(sessionId)
            .then(data => {
                setSession(data);
                if (data.sessionModes) {
                    const mode = data.sessionModes;
                    setSessionTimer(timeStringToSeconds(mode.timeLimits) || 0);
                    warmup.reset(timeStringToSeconds(mode.warmUp) || 0);
                    if (mode.modeDetails) {
                        shooting.reset(timeStringToSeconds(mode.modeDetails.shootingTime) || 0);
                        rest.reset(timeStringToSeconds(mode.modeDetails.restTime) || 0);
                    }
                }
            })
            .catch(err => console.error("Erreur récupération session :", err));
    }, [sessionId]);

    useEffect(() => {
        if (sessionTimer === null) return;
        if (sessionTimer <= 0) {
            setShowEndModal(true);
            return;
        }
        const interval = setInterval(() => setSessionTimer(prev => (prev! > 0 ? prev! - 1 : 0)), 1000);
        return () => clearInterval(interval);
    }, [sessionTimer]);

    const handleHit = async (event: any) => {
        if (!session?.sessionModes?.modeDetails) return;

        const limit = session.sessionModes.modeDetails.shootLimit || Infinity;
        if (shotsFired >= limit) {
            alert("Limite de tirs atteinte !");
            return;
        }

        event.stopPropagation();
        const point: THREE.Vector3 = event.point;
        setHits(prev => [...prev, point.clone()]);

        const distance = Math.sqrt(point.x * point.x + point.y * point.y);
        const hitRing = rings.find(r => distance <= r.radiusOuter && distance >= r.radiusInner);
        const points = hitRing ? hitRing.score : 0;

        setScoreTotal(prev => prev + points);
        setShotsFired(prev => prev + 1);

        const apiPoint = {
            x_Coordinate: point.x,
            y_Coordinate: point.y,
            dateTimePoint: new Date().toISOString(),
            sessionId,
        };

        try {
            await addPoint(apiPoint);
        } catch (err) {
            console.error("Erreur lors de l'ajout du point:", err);
        }
    };

    if (!session) {
        return (
            <>
                <PrivateHeader />
                <div style={{ padding: 20 }}>Chargement de la session...</div>
            </>
        );
    }

    return (
        <>
            <PrivateHeader />
            <div style={{
                height: 'calc(100vh - 60px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 40,
                background: '#f3f4f6',
                padding: 20,
            }}>
                <Canvas style={{ width: 800, height: 800 }} camera={{ position: [0, 0, 3], fov: 50 }}>
                    <ambientLight intensity={0.6} />
                    <directionalLight position={[5, 5, 5]} intensity={0.8} />
                    <TargetRings onHit={handleHit} />
                    {hits.map((pos, i) => <Cross key={i} position={pos} />)}
                </Canvas>

                <div style={{ minWidth: 320, background: "#fff", padding: 20, borderRadius: 12, boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
                    <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Mode de session</h2>
                    {session.sessionModes ? (
                        <>
                            <p style={{ fontWeight: 700, color: "#111827" }}>{session.sessionModes.name}</p>
                            <p style={{ fontSize: 14, color: "#6b7280" }}>Discipline : {session.sessionModes.discipline}</p>
                            <p style={{ fontSize: 14, color: "#6b7280" }}>Temps total session : {formatSeconds(sessionTimer as number)}</p>

                            {session.sessionModes.modeDetails && (
                                <>
                                    <p style={{ fontSize: 14, color: "#374151", marginTop: 8 }}>Limite de tirs : {session.sessionModes.modeDetails.shootLimit}</p>
                                    <TimerControl label="Échauffement" timer={warmup} />
                                    <TimerControl label="Temps de tir" timer={shooting} />
                                    <TimerControl label="Temps de repos" timer={rest} />
                                </>
                            )}
                        </>
                    ) : (
                        <p>Aucun mode disponible</p>
                    )}

                    <div style={{ marginTop: 20 }}>
                        <h3 style={{ fontSize: 18, fontWeight: 600 }}>Score total : {scoreTotal}</h3>
                        <h3 style={{ fontSize: 16, fontWeight: 500 }}>Tirs effectués : {shotsFired}</h3>
                    </div>
                </div>
            </div>

            {showEndModal && <SessionEndModal score={scoreTotal} onClose={() => setShowEndModal(false)} />}
        </>
    );
};
