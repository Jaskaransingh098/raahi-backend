const adminUsername = "admin123"; // your preferred username
const adminPassword = "1234"; // your secure password

const loginAdmin = (req, res) => {
    const { username, password } = req.body;
    console.log("Received login data:", username, password);

    const adminUsername = "admin123";
    const adminPassword = "1234";

    if (username === adminUsername && password === adminPassword) {
        console.log("Admin login successful");
        return res.status(200).json({ success: true, message: "Login successful" });
    } else {
        console.log("Admin login failed");
        return res.status(401).json({ success: false, message: "Invalid credentials" });
    }
};

module.exports = { loginAdmin };