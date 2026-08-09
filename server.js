const express = require("express");
const fs = require("fs");

const app = express();

app.use(express.json());

const PORT = 3000;


// 1. Add User
app.post("/user", (req, res) => {

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        const { name, age, email } = req.body;

        // Check if email already exists
        for (let id in users) {
            if (users[id].email === email) {
                return res.status(400).json({
                    message: "Email already exists."
                });
            }
        }

        // Create new ID
        let newId = 1;

        for (let id in users) {
            if (Number(id) >= newId) {
                newId = Number(id) + 1;
            }
        }

        users[newId] = {
            id: newId,
            name: name,
            age: age,
            email: email
        };

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error writing file"
                    });
                }

                res.json({
                    message: "User added successfully."
                });
            }
        );
    });
});


// 2. Update User
app.patch("/user/:id", (req, res) => {

    const id = req.params.id;

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        if (!users[id]) {
            return res.status(404).json({
                message: "User ID not found."
            });
        }

        const { name, age, email } = req.body;

        if (name !== undefined) {
            users[id].name = name;
        }

        if (age !== undefined) {
            users[id].age = age;
        }

        if (email !== undefined) {
            users[id].email = email;
        }

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error writing file"
                    });
                }

                res.json({
                    message: "User updated successfully."
                });
            }
        );
    });
});


// 3. Delete User using ID from params
app.delete("/user/:id", (req, res) => {

    const id = req.params.id;

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        if (!users[id]) {
            return res.status(404).json({
                message: "User ID not found."
            });
        }

        delete users[id];

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error writing file"
                    });
                }

                res.json({
                    message: "User deleted successfully."
                });
            }
        );
    });
});


// 3. Delete User using ID from body
app.delete("/user", (req, res) => {

    const id = req.body.id;

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        if (!users[id]) {
            return res.status(404).json({
                message: "User ID not found."
            });
        }

        delete users[id];

        fs.writeFile(
            "users.json",
            JSON.stringify(users, null, 2),
            (err) => {

                if (err) {
                    return res.status(500).json({
                        message: "Error writing file"
                    });
                }

                res.json({
                    message: "User deleted successfully."
                });
            }
        );
    });
});


// 4. Get User By Name
app.get("/user/getByName", (req, res) => {

    const name = req.query.name;

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        for (let id in users) {

            if (users[id].name.toLowerCase() === name.toLowerCase()) {

                return res.json(users[id]);
            }
        }

        res.status(404).json({
            message: "User not found."
        });
    });
});


// 5. Get All Users
app.get("/user", (req, res) => {

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        res.json(users);
    });
});


// 6. Filter Users By Minimum Age
app.get("/user/filter", (req, res) => {

    const minAge = Number(req.query.minAge);

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);
        const result = {};

        for (let id in users) {
            if (Number(users[id].age) >= minAge) {
                result[id] = users[id];
            }
        }

        if (Object.keys(result).length === 0) {
            return res.json({
                message: "no user found"
            });
        }

        return res.json(result);
    });
});


// 7. Get User By ID
app.get("/user/:id", (req, res) => {

    const id = req.params.id;

    fs.readFile("users.json", "utf8", (err, data) => {

        if (err) {
            return res.status(500).json({
                message: "Error reading file"
            });
        }

        const users = JSON.parse(data);

        if (!users[id]) {
            return res.status(404).json({
                message: "User ID not found."
            });
        }

        res.json(users[id]);
    });
});


app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});