import { useEffect, useRef } from "react";
import "./login.css";
import { Link } from "react-router-dom";

export default function Login() {
    const containerRef = useRef(null);
    const overlayBtnRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        const overlayBtn = overlayBtnRef.current;

        const togglePanel = () => {
            container.classList.toggle("right-panel-active");

            // Remove the scaling effect and re-trigger the animation
            overlayBtn.classList.remove("btnScaled");
            window.requestAnimationFrame(() => {
                overlayBtn.classList.add("btnScaled");
            });
        };

        overlayBtn.addEventListener("click", togglePanel);

        return () => {
            overlayBtn.removeEventListener("click", togglePanel);
        };
    }, []);

    return (
        <>
            <div className="container" id="container" ref={containerRef}>
                <div className="form-container sign-up-container">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h1>Create Account</h1>
                        <div className="social-container">
                            <button className="social" onClick={() => console.log("Facebook icon clicked!")}>
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button className="social" onClick={() => console.log("Google icon clicked!")}>
                                <i className="fab fa-google"></i>
                            </button>
                            <button className="social" onClick={() => console.log("LinkedIn icon clicked!")}>
                                <i className="fab fa-linkedin-in"></i>
                            </button>
                        </div>
                        <span>or use your email for registration</span>
                        <div className="infield">
                            <input type="text" placeholder="Name" />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input type="email" placeholder="Email" name="email" />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input type="password" placeholder="Password" />
                            <label></label>
                        </div>
                        <button type="submit">Sign Up</button>
                    </form>
                </div>

                <div className="form-container sign-in-container">
                    <form onSubmit={(e) => e.preventDefault()}>
                        <h1>Sign in</h1>
                        <div className="social-container">
                            <button className="social" onClick={() => console.log("Facebook icon clicked!")}>
                                <i className="fab fa-facebook-f"></i>
                            </button>
                            <button className="social" onClick={() => console.log("Google icon clicked!")}>
                                <i className="fab fa-google"></i>
                            </button>
                            <button className="social" onClick={() => console.log("LinkedIn icon clicked!")}>
                                <i className="fab fa-linkedin-in"></i>
                            </button>
                        </div>
                        <span>or use your account</span>
                        <div className="infield">
                            <input type="email" placeholder="Email" name="email" />
                            <label></label>
                        </div>
                        <div className="infield">
                            <input type="password" placeholder="Password" />
                            <label></label>
                        </div>
                        <a href="#" className="forgot">Forgot your password?</a>
                        <button type="submit">Sign In</button>
                    </form>
                </div>

                <div className="overlay-container" id="overlayCon">
                    <div className="overlay">
                        <div className="overlay-panel overlay-left">
                            <h1>Welcome Back!</h1>
                            <p>To keep connected with us please login with your personal info</p>
                            <button onClick={() => document.getElementById("container").classList.remove("right-panel-active")}>
                                Sign In
                            </button>
                        </div>
                        <div className="overlay-panel overlay-right">
                            <h1>Hello, Friend!</h1>
                            <p>Enter your personal details and start your journey with us</p>
                            <button onClick={() => document.getElementById("container").classList.add("right-panel-active")}>
                                Sign Up
                            </button>
                        </div>
                    </div>
                    <button id="overlayBtn" ref={overlayBtnRef}></button>
                </div>
            </div>

            <footer></footer>
        </>
    );
}
