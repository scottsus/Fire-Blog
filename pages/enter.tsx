import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context';
import Metatags from '../components/Metatags';
import { useEffect, useState, useCallback, useContext } from 'react';
import Link from 'next/link';
import debounce from 'lodash.debounce';

export default function EnterPage() {
    const { user, username } = useContext(UserContext);

    return (
        <main>
            <Metatags title="Enter" description="Welcome to Fire-Blog!" />
            {user ? !username ? <UsernameForm /> :
                <div>
                    <h1>Welcome back, {user.displayName}</h1>
                    <Link href="/admin">
                        <button className="btn-blue">Write Posts</button>
                    </Link>
                    <SignOutButton />
                </div> :
                <SignInButton />}
        </main>
    );
}

function UsernameForm() {
    const [formValue, setFormValue] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [loading, setLoading] = useState(false);

    const { user, username } = useContext(UserContext);

    const onSubmit = async event => {
        event.preventDefault();

        const userDoc = firestore.doc(`users/${user.uid}`);
        const usernameDoc = firestore.doc(`usernames/${formValue}`);

        const batch = firestore.batch();
        batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName });
        batch.set(usernameDoc, { uid: user.uid });

        await batch.commit();
    };

    const onChange = event => {
        const val = event.target.value.toLowerCase();
        const regex = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

        if (val < 3) {
            setFormValue(val);
            setLoading(false);
            setIsValid(false);
        }

        if (regex.test(val)) {
            setFormValue(val);
            setLoading(true);
            setIsValid(false);
        }
    };

    useEffect(() => {
        checkUsername(formValue);
    }, [formValue]);

    const checkUsername = useCallback(
        debounce(async username => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`);
                const { exists } = await ref.get();
                console.log('Firestore read executed!');
                setIsValid(!exists);
                setLoading(false);
            }
        }, 500),
        []
    );

    return (
        !username && (
            <section>
                <h3>Choose Username</h3>
                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="myname" value={formValue} onChange={onChange} />
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
                    </button>

                    <h3>Debug State</h3>
                    <div>
                        Username: {formValue}
                        <br />
                        Loading: {loading.toString()}
                        <br />
                        Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )
    );
}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p>Checking...</p>;
    } else if (isValid) {
        return <p className="text-success">{username} is available!</p>;
    } else if (username && !isValid) {
        return <p className="text-danger">That username is taken!</p>;
    } else {
        return <p></p>;
    }
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


