import { useState } from "react";
import NotFound from "./notfound";

const Guide = () => {
    const [videoError, setVideoError] = useState(false);

    return (
        <>
            {videoError ? (
                <NotFound />
            ) : (
                <video 
                    src="https://res.cloudinary.com/dqhn4dq02/video/upload/v1740983213/slbzqgj7bwt6yxfeon1x.mp4" 
                    controls 
                    autoPlay
                    onError={() => setVideoError(true)}
                />
            )}
        </>
    );
};

export default Guide;
