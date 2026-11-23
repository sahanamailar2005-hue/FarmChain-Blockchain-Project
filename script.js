
// FARMCHAIN - COMPLETE JAVASCRIPT

let products = JSON.parse(localStorage.getItem("farmProducts")) || [];

function saveProducts() {
    localStorage.setItem("farmProducts", JSON.stringify(products));
}

function updateDashboard() {
    document.getElementById("totalProducts").textContent = products.length;

    document.getElementById("qualityPassed").textContent =
        products.filter(p => p.qualityPassed === true).length;

    document.getElementById("delivered").textContent =
        products.filter(p => p.status === "Delivered").length;
}

function findProduct(batchId) {
    return products.find(
        p => p.batchId.toLowerCase() === batchId.trim().toLowerCase()
    );
}

// REGISTER PRODUCT
document.getElementById("productForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const batchId = document.getElementById("batchId").value.trim();

    if (findProduct(batchId)) {
        alert("This Batch ID already exists!");
        return;
    }

    const product = {
        id: products.length + 1,
        name: document.getElementById("name").value,
        batchId: batchId,
        farmer: document.getElementById("farmer").value,
        location: document.getElementById("location").value,
        quantity: document.getElementById("quantity").value,
        harvestDate: document.getElementById("harvestDate").value,
        status: "Created",
        qualityPassed: false,
        qualityFailed: false,
        history: [{
            stage: "Product Created",
            location: document.getElementById("location").value,
            notes: "Product registered successfully",
            date: new Date().toLocaleString()
        }]
    };

    products.push(product);
    saveProducts();
    updateDashboard();

    alert("Product registered successfully!");
    this.reset();
});

// TRACK PRODUCT
function trackProduct() {
    const batchId = document.getElementById("searchBatch").value.trim();
    const product = findProduct(batchId);

    const result = document.getElementById("trackResult");

    if (!product) {
        result.textContent = "Product not found. Check the Batch ID.";
        document.getElementById("historyResult").textContent =
            "No history available.";
        return;
    }

    result.innerHTML = `
        <h3>🌱 ${product.name}</h3>
        <p><b>Batch ID:</b> ${product.batchId}</p>
        <p><b>Farmer:</b> ${product.farmer}</p>
        <p><b>Location:</b> ${product.location}</p>
        <p><b>Quantity:</b> ${product.quantity}</p>
        <p><b>Status:</b> ${product.status}</p>
        <p><b>Quality:</b> ${
            product.qualityPassed ? "Passed" :
            product.qualityFailed ? "Failed" : "Not inspected"
        }</p>
    `;

    showHistory(product);
}

// DISPLAY HISTORY
function showHistory(product) {
    const history = document.getElementById("historyResult");

    history.innerHTML = `
        <h3>📦 History of ${product.name}</h3>
        ${product.history.map(item => `
            <div class="history-item">
                <p><b>🌿 ${item.stage}</b></p>
                <p>Location: ${item.location}</p>
                <p>Notes: ${item.notes}</p>
                <p>Date: ${item.date || "Earlier record"}</p>
            </div>
        `).join("")}
    `;
}

// UPDATE PRODUCT STATUS
function updateProductStatus() {
    const batchId = document.getElementById("manageBatch").value.trim();
    const product = findProduct(batchId);

    if (!product) {
        alert("Product not found! Enter FARM001 or a valid Batch ID.");
        return;
    }

    const status = document.getElementById("newStatus").value;
    const location = document.getElementById("updateLocation").value.trim();
    const notes = document.getElementById("updateNotes").value.trim();

    if (!location || !notes) {
        alert("Please enter Current Location and Update Notes.");
        return;
    }

    product.status = status;
    product.location = location;

    product.history.push({
        stage: status,
        location: location,
        notes: notes,
        date: new Date().toLocaleString()
    });

    saveProducts();
    updateDashboard();

    alert("Product status updated successfully!");

    document.getElementById("manageBatch").value = "";
    document.getElementById("updateLocation").value = "";
    document.getElementById("updateNotes").value = "";
}

// QUALITY INSPECTION
function checkQuality() {
    const batchId = document.getElementById("qualityBatch").value.trim();
    const product = findProduct(batchId);

    if (!product) {
        alert("Product not found! Enter a valid Batch ID.");
        return;
    }

    const passed =
        document.getElementById("qualityStatus").value === "true";

    const notes = document.getElementById("qualityNotes").value.trim();

    if (!notes) {
        alert("Please enter Inspection Notes.");
        return;
    }

    product.qualityPassed = passed;
    product.qualityFailed = !passed;

    product.history.push({
        stage: "Quality Inspection",
        location: product.location,
        notes: notes + (passed ? " - PASSED" : " - FAILED"),
        date: new Date().toLocaleString()
    });

    saveProducts();
    updateDashboard();

    alert(passed ?
        "Quality inspection passed!" :
        "Quality inspection failed!"
    );

    document.getElementById("qualityBatch").value = "";
    document.getElementById("qualityNotes").value = "";
}

// INITIALIZE DASHBOARD
updateDashboard();
// PRODUCT RECALL
function recallProduct() {
    const batchId = document.getElementById("recallBatch").value.trim();
    const reason = document.getElementById("recallReason").value.trim();
    const product = findProduct(batchId);

    if (!product) {
        alert("Product not found! Enter a valid Batch ID.");
        return;
    }

    if (!reason) {
        alert("Please enter the reason for recall.");
        return;
    }

    if (product.status === "Recalled") {
        alert("This product is already recalled.");
        return;
    }

    product.status = "Recalled";
    product.history.push({
        stage: "Product Recalled",
        location: product.location,
        notes: reason,
        date: new Date().toLocaleString()
    });

    saveProducts();
    updateDashboard();
    alert("Product recalled successfully!");

    document.getElementById("recallBatch").value = "";
    document.getElementById("recallReason").value = "";
}