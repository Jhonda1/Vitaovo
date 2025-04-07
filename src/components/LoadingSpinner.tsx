import React  from 'react';
import {
    BarLoader,
    BeatLoader,
    BounceLoader,
    ClimbingBoxLoader,
    ClipLoader,
    ClockLoader,
    FadeLoader,
    MoonLoader,
    PacmanLoader,
    PropagateLoader,
    PuffLoader,
    PulseLoader,
    RingLoader,
    ScaleLoader,
    SyncLoader
} from 'react-spinners';

type LoaderType = 'bar' | 'beat' | 'bounce' | 'climbingBox' | 'clip' | 'clock' | 'fade' | 'moon' | 'pacman' | 'propagate' | 'puff' | 'pulse' | 'ring' | 'scale' | 'sync';

const loaderTypes: Record<LoaderType, React.ComponentType<any>> = {
    bar: BarLoader,
    beat: BeatLoader,
    bounce: BounceLoader,
    climbingBox: ClimbingBoxLoader,
    clip: ClipLoader,
    clock: ClockLoader,
    fade: FadeLoader,
    moon: MoonLoader,
    pacman: PacmanLoader,
    propagate: PropagateLoader,
    puff: PuffLoader,
    pulse: PulseLoader,
    ring: RingLoader,
    scale: ScaleLoader,
    sync: SyncLoader,
};

interface LoadingSpinnerProps {
    loading?: boolean;
    color?: string;
    type?: LoaderType;
    size?: number;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({loading = false, color = "#92bd4e", type = "bounce", size = 60,}) => 
{
    if (!loading) return null;
    const LoaderComponent = loaderTypes[type] || ClipLoader;
    return (
        <div className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50">
            <LoaderComponent color={color} size={size} />
        </div>
    );
};