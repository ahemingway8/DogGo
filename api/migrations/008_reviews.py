steps = [
    [
        """
        CREATE TABLE reviews (
            id SERIAL PRIMARY KEY,
            rating INTEGER NOT NULL,
            comment TEXT,
            service_id INTEGER REFERENCES services(id),
            created_by INTEGER REFERENCES users(id)
        );
        """,
        """
        DROP TABLE reviews;
        """,

    ]
]
