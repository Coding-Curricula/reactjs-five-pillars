import React, { Fragment, useState, useEffect, useCallback } from 'react'
import Joi from 'joi-browser';

const usersSchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().required(),
    address: Joi.object({
        street: Joi.string().required(),
        suite: Joi.string().required(),
        city: Joi.string().required(),
        zipcode: Joi.string().required(),
        geo: Joi.object({
            lat: Joi.string().required(),
            lng: Joi.string().required()
        })
    }),
    phone: Joi.string().required(),
    website: Joi.string().required(),
    company: Joi.object({
        name: Joi.string().required(),
        catchPhrase: Joi.string().required(),
        bs: Joi.string().required()
    })
});


export default function Users() {
    const [users, setUsers] = useState([]);
    const [aboutController, setAboutController] = useState(new AbortController());
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const validateUser = useCallback((user) => {
        const result = Joi.validate(user, usersSchema);
        return !result.error;
    }, []);

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
                if (!newUsers.every(validateUser)) {
                    throw new Error('Invalid data');
                }

                console.log(newUsers);
                console.log(process.env.REACT_APP_SOME_VALUE);
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
            <ol>
                {users.map(user => (
                    <li key={user.id}>
                        <h3>{user.name}</h3>
                        <p>{user.email}</p>
                        <p>{user.phone}</p>
                        <p>{user.website}</p>
                    </li>
                ))}
            </ol>
            <button onClick={cancel}>Cancel</button>
        </Fragment>
    )
}
