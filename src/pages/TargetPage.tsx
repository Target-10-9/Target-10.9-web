import React, { useEffect, useMemo, useState } from 'react';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { FaPlay, FaStop, FaRedo } from 'react-icons/fa';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

import { PrivateHeader } from '../components/PrivateHeader';
import { addPoint, getPointsBySessionId } from '../features/points/pointsAPI';
import { getSessionById } from '../features/sessions/sessionsAPI';
import { timeStringToSeconds, formatSeconds } from '../utils/timeUtils';
import { Overlay } from '../components/Overlay';

const MAX_RADIUS = 1.0;
const RING_COUNT = 10;
const RING_WIDTH = MAX_RADIUS / RING_COUNT;

type Ring = { radiusOuter: number; radiusInner: number; color: string; score: number };

function colorForScore(score: number) {
    if (score >= 9) return '#ffff00';
    if (score >= 7) return '#ff0000';
    if (score >= 5) return '#0000ff';
    if (score >= 3) return '#000000';
    return '#ffffff';
}

const rings: Ring[] = Array.from({ length: RING_COUNT }).map((_, i) => {
    const outer = MAX_RADIUS - i * RING_WIDTH;
    const inner = Math.max(0, outer - RING_WIDTH);
    const score = i + 1;
    return { radiusOuter: outer, radiusInner: inner, color: colorForScore(score), score };
});

const TargetRings: React.FC<{ onHit: (e: any) => void }> = ({ onHit }) => (
    <group>
        {rings.map((r, i) => (
            <mesh key={i} onPointerDown={onHit} position={[0, 0, i * 0.0005]}>
                <ringGeometry args={[r.radiusInner, r.radiusOuter, 64]} />
                <meshBasicMaterial color={r.color} side={THREE.DoubleSide} />
            </mesh>
        ))}
    </group>
);

const Cross: React.FC<{ position: THREE.Vector3; size?: number }> = ({ position, size = 0.06 }) => {
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
};

/* --------- TIMERS --------- */
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

const TimerControl: React.FC<{ label: string; timer: ReturnType<typeof useManualCountdown> }> = ({ label, timer }) => (
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
                <button onClick={timer.start} disabled={timer.running} style={buttonStyle('#4ade80', timer.running)}>
                    <FaPlay />
                </button>
                <button onClick={timer.stop} disabled={!timer.running} style={buttonStyle('#f87171', !timer.running)}>
                    <FaStop />
                </button>
                <button onClick={() => timer.reset()} style={buttonStyle('#60a5fa', false)}>
                    <FaRedo />
                </button>
            </div>
        </div>
    </div>
);

const buttonStyle = (bg: string, disabled: boolean) => ({
    background: bg,
    border: 'none',
    padding: '6px 10px',
    borderRadius: 4,
    cursor: disabled ? 'not-allowed' : 'pointer',
    color: '#fff',
});

/* --------- TYPES --------- */
type TargetPageProps = { sessionId: string };
type ApiPoint = { id?: string; x_Coordinate: number; y_Coordinate: number; dateTimePoint?: string; sessionId: string };
type Shot = { position: THREE.Vector3; score: number };

/* --------- HELPERS --------- */
function scoreForXY(x: number, y: number): number {
    const distance = Math.sqrt(x * x + y * y);
    const hitRing = rings.find(r => distance <= r.radiusOuter && distance >= r.radiusInner);
    return hitRing ? hitRing.score : 0;
}

export const TargetPage: React.FC<TargetPageProps> = ({ sessionId }) => {
    const [shots, setShots] = useState<Shot[]>([]);
    const [scoreTotal, setScoreTotal] = useState(0);
    const [session, setSession] = useState<any>(null);
    const [shotsFired, setShotsFired] = useState(0);

    const shooting = useManualCountdown(0);
    const rest = useManualCountdown(0);

    /* ---- Charger session + points ---- */
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const sess = await getSessionById(sessionId);
                if (!mounted) return;

                setSession(sess);
                if (sess?.sessionModes?.modeDetails) {
                    const mode = sess.sessionModes;
                    shooting.reset(timeStringToSeconds(mode.modeDetails?.shootingTime) || 0);
                    rest.reset(timeStringToSeconds(mode.modeDetails?.restTime) || 0);
                    shooting.start();
                }

                const apiPoints: ApiPoint[] = await getPointsBySessionId(sessionId);
                if (!mounted) return;

                const mapped: Shot[] = (apiPoints || []).map(p => ({
                    position: new THREE.Vector3(p.x_Coordinate, p.y_Coordinate, 0),
                    score: scoreForXY(p.x_Coordinate, p.y_Coordinate),
                }));

                setShots(mapped);
                setShotsFired(mapped.length);
                setScoreTotal(mapped.reduce((sum, s) => sum + s.score, 0));
            } catch (e) {
                console.error('Erreur initialisation TargetPage :', e);
            }
        })();
        return () => { mounted = false; };
    }, [sessionId]);

    /* ---- Gestion d'un tir ---- */
    const handleHit = async (event: any) => {
        if (!session?.sessionModes?.modeDetails) return;

        const limit = session.sessionModes.modeDetails.shootLimit || Infinity;

        if (shotsFired >= limit || shooting.seconds <= 0) return;

        event.stopPropagation();
        const p: THREE.Vector3 = event.point;
        const score = scoreForXY(p.x, p.y);

        setShots(prev => [...prev, { position: new THREE.Vector3(p.x, p.y, 0), score }]);
        setScoreTotal(prev => prev + score);
        setShotsFired(prev => prev + 1);

        try {
            await addPoint({ x_Coordinate: p.x, y_Coordinate: p.y, dateTimePoint: new Date().toISOString(), sessionId });
        } catch (err) {
            console.error("Erreur lors de l'ajout du point:", err);
        }
    };

    /* ---- Détail des tirs par groupe de 10 ---- */
    const shotsGrouped = useMemo(() => {
        const groups: { group: number; count: number; total: number }[] = [];
        for (let i = 0; i < shots.length; i += 10) {
            const chunk = shots.slice(i, i + 10);
            groups.push({ group: i / 10 + 1, count: chunk.length, total: chunk.reduce((sum, s) => sum + s.score, 0) });
        }
        return groups;
    }, [shots]);

    /* ---- Détail des tirs tir par tir ---- */
    const shotsDetailed = useMemo(() => shots.map((s, i) => `${i + 1} → ${s.score}`), [shots]);

    if (!session) return <><PrivateHeader /><div style={{ padding: 20 }}>Chargement de la session...</div></>;

    /* ---- Overlays ---- */
    const paused = !shooting.running && shooting.seconds > 0;
    const limitReached = session?.sessionModes?.modeDetails && shotsFired >= session.sessionModes.modeDetails.shootLimit;
    const timerEnded = shooting.seconds <= 0 && !shooting.running;
    const sessionEnded = limitReached || timerEnded;

    return (
        <>
            <PrivateHeader />
            <div style={{ height: 'calc(100vh - 60px)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, background: '#f3f4f6', padding: 20, position: 'relative' }}>

                {/* SCORE TOTAL */}
                <h2 style={{ fontSize: 28, fontWeight: 700, color: '#111827' }}>Score total : {scoreTotal}</h2>

                <div style={{ display: 'flex', gap: 40, alignItems: 'flex-start' }}>
                    {/* GROUPES DE 10 À GAUCHE */}
                    <div style={{ minWidth: 100, maxHeight: 800, overflow: 'auto', background: '#fff', padding: 12, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Tirs par groupe de 10</h3>
                        {shotsGrouped.length === 0 ? <p style={{ color: '#6b7280' }}>Aucun tir</p> :
                            shotsGrouped.map(g => (
                                <p key={g.group} style={{ margin: 2 }}>{g.group} : {g.count} → {g.total}</p>
                            ))}
                    </div>

                    {/* CIBLE */}
                    <Canvas style={{ width: 700, height: 700 }} camera={{ position: [0, 0, 3], fov: 50 }}>
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[5, 5, 5]} intensity={0.8} />

                        {/* Carré de fond derrière la cible */}
                        <mesh position={[0, 0, -0.01]}>
                            <planeGeometry args={[MAX_RADIUS * 2.5, MAX_RADIUS * 2.5]} />
                            <meshBasicMaterial color="#f0f0f0" />
                        </mesh>

                        <TargetRings onHit={handleHit} />
                        {shots.map((s, i) => <Cross key={i} position={s.position} />)}
                    </Canvas>


                    {/* PANNEAU DROIT */}
                    <div style={{ minWidth: 340, maxHeight: 800, overflow: 'auto', background: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                        <h2 style={{ fontSize: 22, fontWeight: 600, marginBottom: 12 }}>Mode de session</h2>
                        {session.sessionModes ? <>
                            <p style={{ fontWeight: 700, color: '#111827' }}>{session.sessionModes.name}</p>
                            <p style={{ fontSize: 14, color: '#6b7280' }}>Discipline : {session.sessionModes.discipline}</p>
                            {session.sessionModes.modeDetails && <>
                                <p style={{ fontSize: 14, color: '#374151', marginTop: 8 }}>Limite de tirs : {session.sessionModes.modeDetails.shootLimit}</p>
                                {shooting.seconds > 0 && <TimerControl label="Temps de tir" timer={shooting} />}
                            </>}
                        </> : <p>Aucun mode disponible</p>}

                        <div style={{ marginTop: 16 }}>
                            <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Détail des tirs (n° → score)</h3>
                            <div style={{ maxHeight: 260, overflow: 'auto', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: 8, background: '#fafafa', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', fontSize: 14 }}>
                                {shotsDetailed.length === 0 ? <div style={{ color: '#6b7280' }}>Aucun tir pour le moment.</div> : shotsDetailed.map((line, idx) => <div key={idx} style={{ padding: '2px 0' }}>{line}</div>)}
                            </div>

                            <div style={{ marginTop: 20 }}>
                                <h3 style={{ fontSize: 16, fontWeight: 500 }}>Tirs effectués : {shotsFired}</h3>
                            </div>
                        </div>
                    </div>
                </div>

                {/* OVERLAYS */}
                <Overlay
                    visible={paused && !sessionEnded}
                    title="PAUSE"
                    subText={rest.seconds > 0 ? formatSeconds(rest.seconds) : undefined}
                    onButtonClick={() => shooting.start()}
                    buttonText="Reprendre"
                />

                <Overlay
                    visible={sessionEnded}
                    title="SESSION TERMINÉE"
                    buttonText="Retour au détail"
                    onButtonClick={() => window.location.href = `/session/${sessionId}`}
                />
            </div>
        </>
    );
};
