import { useEffect, useRef, useState } from "react";

const ScoreGauge = ({ score = 75 }: { score: number }) => { // initialize ScoreGauge component and read score with default so gauge always has a valid value
    const [pathLength, setPathLength] = useState(0); // store total path length so stroke animation can use correct value

    const pathRef = useRef<SVGPathElement>(null); // create ref to access SVG path in the DOM so we can measure its length

    const percentage = score / 100; // convert numeric score to a percentage so gauge arc can represent progress visually

    useEffect(() => { // run effect after mount to measure SVG path length once DOM is ready
        if (pathRef.current) { // ensure path exists so getTotalLength call doesn't fail
            setPathLength(pathRef.current.getTotalLength()); // compute and store total path length so stroke-drawing animation is accurate
        }
    }, []); // empty dependency so length is measured only once on initial render

    return (
        <div className="flex flex-col items-center">
            <div className="relative w-40 h-20">
                <svg viewBox="0 0 100 50" className="w-full h-full">
                    <defs>
                        <linearGradient
                            id="gaugeGradient"
                            x1="0%"
                            y1="0%"
                            x2="100%"
                            y2="0%"
                        >
                            <stop offset="0%" stopColor="#a78bfa" />
                            <stop offset="100%" stopColor="#fca5a5" />
                        </linearGradient>
                    </defs>

                    <path
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                        strokeLinecap="round"
                    />

                    <path
                        ref={pathRef}
                        d="M10,50 A40,40 0 0,1 90,50"
                        fill="none"
                        stroke="url(#gaugeGradient)"
                        strokeWidth="10"
                        strokeLinecap="round"
                        strokeDasharray={pathLength}
                        strokeDashoffset={pathLength * (1 - percentage)}
                    />
                </svg>

                <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                    <div className="text-xl font-semibold pt-4">{score}/100</div>
                </div>
            </div>
        </div>
    );
};

export default ScoreGauge;
