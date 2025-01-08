steps = [
    [
        """
        CREATE TABLE events (
            id SERIAL PRIMARY KEY NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT NOT NULL,
            address VARCHAR(255) NOT NULL,
            date_time TIMESTAMP NOT NULL,
            picture_url VARCHAR(255) DEFAULT 'https://i.pinimg.com/736x/7c/b4/9e/7cb49e3afe82d5c4e54bdcda13f625a0.jpg'
        );
        """,
        """
        DROP TABLE events;
        """
    ]
]
