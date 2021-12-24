import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function NavBar() {
    const { user, username } = useContext(UserContext);

    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">NXT</button>
                    </Link>
                </li>

                {username && (
                    <>
                        <li className="push-left">
                            <button>Sign Out</button>
                        </li>
                        <li>
                            <Link href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>
                        <li>
                            <Link href="{`${username}`}">
                                <img src="/hacker.png"></img>
                            </Link>
                        </li>
                    </>
                )}

                {!username && (
                    <>
                        <Link href="/enter">
                            <button className="btn-blue">Log In</button>
                        </Link>
                    </>
                )}

            </ul>
        </nav>


    )
}