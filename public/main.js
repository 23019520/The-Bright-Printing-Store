let timeout;

document.addEventListener('DOMContentLoaded', () => {
    const uploadArea = document.getElementById('upload-area');
    const fileInput = document.getElementById('file-input');
    const mainContent = document.getElementById('main-content');
    const flyerPreview = document.getElementById('flyer-preview');
    const paperColor = document.getElementById("paperColor");
    const quantityInput = document.getElementById("pages"); // Assuming this is the input for quantity
    const residenceInput = document.getElementById("residence");
    const orderForm = document.getElementById('order-form');

    // Handle drag-and-drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    // Handle file input selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    // Handle file processing
    function handleFile(file) {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                flyerPreview.src = e.target.result;
                mainContent.style.display = 'flex'; // Show the main content
                document.getElementById('upload-section').style.display = 'none'; // Hide the upload section
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please upload a valid image file.');
        }
    }

    // Price and Paper Type Constants
    const prices = {
        "A4_White": 3,  // Price per A4 white paper
        "A4_Color": 5,   // Price per A4 colored paper (Blue/Pink)
        "A5": 2,         // Price per A5 paper
        "A3": 5          // Price per A3 paper
    };

    // Function to calculate total price
    function calculatePrice(paperType, quantity) {
        let pricePerUnit;

        // Determine the price per unit based on paper type
        if (paperType === "A4_White") {
            pricePerUnit = prices.A4_White;
        } else if (paperType === "A4_Color") {
            pricePerUnit = prices.A4_Color;
        } else if (paperType === "A5") {
            pricePerUnit = prices.A5;
        } else if (paperType === "A3") {
            pricePerUnit = prices.A3;
        }

        let totalPrice = pricePerUnit * quantity;

        // Apply discounts if applicable
        if (quantity > 50) {
            totalPrice *= 0.8; // 20% off for quantities over 50
        } else if (quantity > 20) {
            totalPrice *= 0.9; // 10% off for quantities over 20
        }

        return totalPrice;
    }

    // Function to calculate delivery time
    function calculateDeliveryTime() {
        const currentTime = new Date();
        let nextDeliveryTime = "7am";

        // Check current time and set next delivery time
        if (currentTime.getHours() >= 22) {
            nextDeliveryTime = "7am"; // If after 10pm, next delivery is at 7am
        } else if (currentTime.getHours() >= 17) {
            nextDeliveryTime = "10pm"; // If after 5pm, next delivery is at 10pm
        } else if (currentTime.getHours() >= 13) {
            nextDeliveryTime = "5pm"; // If after 1pm, next delivery is at 5pm
        } else if (currentTime.getHours() >= 7) {
            nextDeliveryTime = "1pm"; // If after 7am, next delivery is at 1pm
        }

        return nextDeliveryTime;
    }

    // Update the price, delivery time, and residence input
    function updateOrderDetails() {
        const paperType = paperColor.value;
        const quantity = quantityInput.value; // Get quantity input value

        // Calculate total price
        const totalPrice = calculatePrice(paperType, quantity);
        document.getElementById("total-price").textContent = `R ${totalPrice.toFixed(2)}`;

        // Set the delivery time
        const deliveryTime = calculateDeliveryTime();
        document.getElementById("delivery-time").textContent = deliveryTime;

        // Handle Residence field (for now just showing the input box)
        const residence = residenceInput.value;
        console.log("Delivery to: " + residence);
    }

    // Event listeners for input changes to trigger price and delivery time update
    paperColor.addEventListener('change', updateOrderDetails);
    quantityInput.addEventListener('input', updateOrderDetails);
    residenceInput.addEventListener('input', updateOrderDetails);

    // Call the function once to initialize
    updateOrderDetails();

    // Listen for input events and set a timeout for form submission after inactivity
    document.addEventListener('input', (e) => {
        // Clear the previous timer if there is one
        clearTimeout(timeout);

        // Set a new timer to submit the form after 5 seconds of inactivity
        timeout = setTimeout(submitFormData, 5000);
    });

    function submitFormData() {
        const formData = new FormData(orderForm);

        // Example: Send data via fetch or an AJAX request
        fetch('/submit_order', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            console.log('Order submitted successfully:', data);
        })
        .catch(error => {
            console.error('Error submitting order:', error);
        });
    }
});
