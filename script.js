// Updates row subtotals and grand total live on order.html
function updateTotals() {
    const rows = document.querySelectorAll("#order-table tbody tr");
    let grandTotal = 0;

    rows.forEach(row => {
        const price = parseFloat(row.getAttribute("data-price"));
        const qtyInput = row.querySelector(".qty-input");
        const qty = parseInt(qtyInput.value) || 0;
        const subtotal = price * qty;

        row.querySelector(".row-subtotal").textContent = "$" + subtotal.toFixed(2);
        grandTotal += subtotal;
    });

    const totalDisplay = document.getElementById("grand-total");
    if (totalDisplay) {
        totalDisplay.textContent = "$" + grandTotal.toFixed(2);
    }
}

// Saves selected items to sessionStorage and redirects to confirmation.html
function confirmOrder() {
    const rows = document.querySelectorAll("#order-table tbody tr");
    const selectedItems = [];
    let grandTotal = 0;

    rows.forEach(row => {
        const name = row.getAttribute("data-name");
        const price = parseFloat(row.getAttribute("data-price"));
        const qty = parseInt(row.querySelector(".qty-input").value) || 0;

        if (qty > 0) {
            const subtotal = price * qty;
            selectedItems.push({ name, price, qty, subtotal });
            grandTotal += subtotal;
        }
    });

    if (selectedItems.length === 0) {
        alert("Please select a quantity of at least 1 item before confirming your order!");
        return;
    }

    sessionStorage.setItem("meowOrderItems", JSON.stringify(selectedItems));
    sessionStorage.setItem("meowOrderTotal", grandTotal.toFixed(2));

    window.location.href = "confirmation.html";
}

// Loads order receipt and launches confetti on confirmation.html
function loadConfirmationPage() {
    const summaryBody = document.getElementById("receipt-body");
    if (!summaryBody) return;

    const items = JSON.parse(sessionStorage.getItem("meowOrderItems") || "[]");
    const total = sessionStorage.getItem("meowOrderTotal") || "0.00";

    if (items.length === 0) {
        summaryBody.innerHTML = `<tr><td colspan="4">No items found. Please place an order first!</td></tr>`;
    } else {
        items.forEach(item => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>$${item.price.toFixed(2)}</td>
                <td>${item.qty}</td>
                <td>$${item.subtotal.toFixed(2)}</td>
            `;
            summaryBody.appendChild(tr);
        });
    }

    document.getElementById("receipt-total").textContent = "$" + total;
    launchConfetti();
}

// Pure JavaScript Confetti Burst
function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const colors = [
        "rgb(191, 63, 84)",
        "#ff8fa3",
        "#ffd166",
        "#06d6a0",
        "#118ab2",
        "#ffffff"
    ];

    const pieces = [];
    for (let i = 0; i < 160; i++) {
        pieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height - canvas.height,
            w: Math.random() * 10 + 6,
            h: Math.random() * 6 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            speedY: Math.random() * 3 + 2,
            speedX: Math.random() * 2 - 1,
            angle: Math.random() * 360,
            spin: Math.random() * 6 - 3
        });
    }

    let frame = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        pieces.forEach(p => {
            p.y += p.speedY;
            p.x += p.speedX;
            p.angle += p.spin;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.angle * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        if (frame < 260) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    animate();
}