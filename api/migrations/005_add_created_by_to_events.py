steps = [
    [
        # "Up" SQL statement
        """
        ALTER TABLE events
        ADD created_by integer NOT NULL DEFAULT(1) REFERENCES users(id);
        """,
        # "Down" SQL statement
        """
        ALTER TABLE events
        DROP COLUMN created_by;
        """,
    ],
]
