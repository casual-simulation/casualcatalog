const { useEffect, useState, useRef, useCallback, useImperativeHandle } = os.appHooks;
const { forwardRef } = os.appCompat;

interface CreditDisplayProps {
    name: string;
    amount: number;
    icon: string;
    animate?: boolean;
    onClick?: () => void;
}

interface FloatingNumber {
    id: number;
    value: number;
}

interface CoinParticle {
    id: number;
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    startTime: number;
    duration: number;
    arcHeight: number;
    offsetX: number;
    progress: number;
}

function easeOutCubic(t: number) {
    return 1 - Math.pow(1 - t, 3);
}

function easeInOutQuad(t: number) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

let floatId = 0;
let coinId = 0;

const FLOATS_TIMEOUT_MS = 2000;
const PULSE_TIMEOUT_MS = 500;

const CreditDisplay = forwardRef(({
    name,
    amount,
    icon,
    animate = false,
    onClick
}: CreditDisplayProps, ref) => {
    const [displayAmount, setDisplayAmount] = useState(amount);
    const [pulse, setPulse] = useState(false);
    const [floats, setFloats] = useState<FloatingNumber[]>([]);
    const [coins, setCoins] = useState<CoinParticle[]>([]);
    const prevAmountRef = useRef(amount);
    const animFrameRef = useRef<number | null>(null);
    const coinsLoopRef = useRef<number | null>(null);
    const widgetRef = useRef<HTMLDivElement | null>(null);

    // --- Number animation ---
    useEffect(() => {
        const from = prevAmountRef.current;
        const to = amount;
        prevAmountRef.current = amount;

        if (!animate || from === to) {
            setDisplayAmount(to);
            return;
        }

        setPulse(true);

        const diff = to - from;
        const id = ++floatId;
        setFloats(prev => [...prev, { id, value: diff }]);
        setTimeout(() => {
            setFloats(prev => prev.filter(f => f.id !== id));
        }, FLOATS_TIMEOUT_MS);

        const duration = Math.min(1500, 400 + Math.abs(to - from) * 5);
        const start = performance.now();

        function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            setDisplayAmount(Math.round(from + (to - from) * easeOutCubic(t)));
            if (t < 1) {
                animFrameRef.current = requestAnimationFrame(tick);
            }
        }

        animFrameRef.current = requestAnimationFrame(tick);
        return () => {
            if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
        };
    }, [amount, animate]);

    // --- Pulse ---
    useEffect(() => {
        if (!pulse) return;
        const t = setTimeout(() => setPulse(false), PULSE_TIMEOUT_MS);
        return () => clearTimeout(t);
    }, [pulse]);

    // --- Coin animation loop ---
    useEffect(() => {
        if (coins.length === 0) {
            if (coinsLoopRef.current) cancelAnimationFrame(coinsLoopRef.current);
            coinsLoopRef.current = null;
            return;
        }

        function loop() {
            const now = performance.now();
            setCoins(prev =>
                prev
                    .map(c => ({ ...c, progress: Math.min(1, (now - c.startTime) / c.duration) }))
                    .filter(c => c.progress < 1)
            );
            coinsLoopRef.current = requestAnimationFrame(loop);
        }

        coinsLoopRef.current = requestAnimationFrame(loop);
        return () => {
            if (coinsLoopRef.current) cancelAnimationFrame(coinsLoopRef.current);
        };
    }, [coins.length > 0]);

    // --- Imperative API ---
    const spawnCoins = useCallback((count: number, startX: number, startY: number, targetX: number, targetY: number) => {
        const now = performance.now();

        const newCoins: CoinParticle[] = Array.from({ length: count }, (_, i) => ({
            id: ++coinId,
            startX,
            startY,
            targetX,
            targetY,
            startTime: now + i * 60,
            duration: 700 + (Math.random() * 300),
            arcHeight: 40 + (Math.random() * 80),
            offsetX: (Math.random() - 0.5) * 60,
            progress: 0,
        }));

        setCoins(prev => [...prev, ...newCoins]);
    }, []);

    useImperativeHandle(ref, () => ({ spawnCoins }), [spawnCoins]);

    // --- Render a single coin ---
    const renderCoin = (c: CoinParticle) => {
        const t = easeInOutQuad(c.progress);

        const x = c.startX + (c.targetX - c.startX) * t + c.offsetX * (1 - t);
        const baseY = c.startY + (c.targetY - c.startY) * t;
        const arc = -c.arcHeight * 4 * t * (1 - t);
        const y = baseY + arc;

        const scale = 1 - t * 0.4;
        const opacity = t > 0.85 ? 1 - (t - 0.85) / 0.15 : 1;

        return (
            <img
                key={c.id}
                src={icon}
                className="credit-coin"
                style={{
                    left: `${x}px`,
                    top: `${y}px`,
                    transform: `translate(-50%, -50%) scale(${scale})`,
                    opacity,
                }}
            />
        );
    };

    return (
        <>
            <div
                ref={widgetRef}
                className={`credit-display ${pulse ? 'credit-pulse' : ''} ${displayAmount === 0 ? 'credit-empty' : ''}`}
                onClick={onClick}
                style={{ position: 'relative' }}
            >
                <img src={icon}></img>
                <span>{displayAmount === 0 ? 'ads mode' : displayAmount.toLocaleString()}</span>
                {floats.map(f => (
                    <span
                        key={f.id}
                        className="credit-float"
                        style={{ color: f.value > 0 ? '#22c55e' : '#ef4444' }}
                    >
                        {f.value > 0 ? '+' : ''}{f.value}
                    </span>
                ))}
            </div>
            {coins.map(renderCoin)}
        </>
    );
});

return CreditDisplay;