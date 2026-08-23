const BACKEND_URL = "http://localhost:5000";
const RAZORPAY_KEY_ID = "YOUR_PUBLIC_KEY_ID"; // Use your public Key ID here (starts with rzp_test_)

document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("subscribeProBtn");
    if (btn) btn.addEventListener("click", startSubscription);
});

async function startSubscription() {
    const userEmail = sessionStorage.getItem("loggedInUser");
    if (!userEmail) {
        alert("Please log in to upgrade to Pro.");
        window.location.href = "login.html";
        return;
    }

    try {
        // 1. Fetch order_id from backend
        const response = await fetch(`${BACKEND_URL}/api/create-order`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ amount: 499, planName: "Pro Tier" })
        });

        const data = await response.json();
        if (!data.success) {
            alert("Could not start payment. Ensure backend server is running.");
            return;
        }

        // 2. Configure Checkout Options
        const options = {
            key: RAZORPAY_KEY_ID,
            amount: data.order.amount,
            currency: data.order.currency,
            name: "OverloadFit",
            description: "Pro Tier Membership",
            order_id: data.order.id,
            prefill: { email: userEmail },
            theme: { color: "#00aaff" },
            handler: async function (rzpResponse) {
                // 3. Verify Signature
                const verifyRes = await fetch(`${BACKEND_URL}/api/verify-payment`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        razorpay_order_id: rzpResponse.razorpay_order_id,
                        razorpay_payment_id: rzpResponse.razorpay_payment_id,
                        razorpay_signature: rzpResponse.razorpay_signature,
                        userEmail: userEmail
                    })
                });

                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                    // Update user state in localStorage
                    let users = JSON.parse(localStorage.getItem("users")) || [];
                    users = users.map(u => u.email === userEmail ? { ...u, isPro: true } : u);
                    localStorage.setItem("users", JSON.stringify(users));

                    alert("Payment Verified! Welcome to OverloadFit PRO.");
                    window.location.reload();
                } else {
                    alert("Payment verification failed.");
                }
            }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
    } catch (err) {
        console.error("Payment error:", err);
        alert("Server connection failed.");
    }
}