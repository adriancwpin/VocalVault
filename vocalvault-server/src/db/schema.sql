    CREATE TABLE categories(
        id SERIAL PRIMARY KEY,
        name VARCHAR(50) UNIQUE NOT NULL,
        keywords TEXT[] DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    CREATE TABLE expenses(
        id SERIAL PRIMARY KEY,
        amount DECIMAL(10,2) NOT NULL CHECK (amount > 0),
        category_id INT REFERENCES categories(id) ON DELETE SET NULL,
        description TEXT,
        raw_text TEXT,
        source VARCHAR(10) DEFAULT 'manual' CHECK(source IN('voice', 'manual')),
        created_at TIMESTAMPTZ DEFAULT NOW()
    );


