steps = [
    [
        """
        CREATE TABLE services (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price FLOAT NOT NULL,
            location VARCHAR(255),
            contact TEXT,
            picture_url TEXT,
            created_by INTEGER REFERENCES users(id
        );
        """,
        """
        DROP TABLE services;
        """,
    ]
]
