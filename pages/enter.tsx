import { auth, googleAuthProvider } from '../lib/firebase';
import { useContext } from 'react';
import { UserContext } from '../lib/context';

export default function EnterPage() {
    const { user, username } = useContext(UserContext);

    return (
        <div>
            {user ? !username ? <UsernameForm /> : <SignOutButton /> : <SignInButton />}
        </div>
    )
}

function SignInButton() {
    const signInWithGoogle = async () => await auth.signInWithPopup(googleAuthProvider);

    return (
        <button onClick={signInWithGoogle} className="btn-google">
            <img src="./google.png" /> Sign in with Google
        </button>
    );
};

function SignOutButton() {
    const signOutWithGoogle = () => auth.signOut();

    return (
        <button onClick={signOutWithGoogle}>
            Sign Out
        </button>
    );
};

function UsernameForm() {
    return <div></div>
}

