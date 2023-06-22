import React, { Fragment, useState, useEffect, useCallback } from 'react'

export default function Users() {
    const [users, setUsers] = useState([]);
    const [aboutController, setAboutController] = useState(new AbortController());
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const cancel = useCallback(() => {
        aboutController.abort();
    }, [aboutController]);

    useEffect(() => {
        const newAboutController = new AbortController();
        const { signal } = newAboutController;

        setAboutController(newAboutController);
        setError(null);
        setLoading(true);

        fetch('https://jsonplaceholder.typicode.com/users', { signal })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }

                return Promise.reject(new Error('Failed to load'));
            })
            .then(newUsers => {
                setUsers(newUsers);
            })
            .catch(error => {
                setError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);



    return (
        <Fragment>
            {loading && <p>Loading...</p>}
            {error && <p>{error.message}</p>}
            <ul>
                {users.map(user => (
                    <li key={user.id}>{user.name}</li>
                ))}
            </ul>
            <button onClick={cancel}>Cancel</button>
        </Fragment>
    )
}
