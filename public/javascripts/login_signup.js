document.addEventListener("DOMContentLoaded", () => {
	const signUpLink = document.querySelector('.sign-up-link');
	const signInLink = document.querySelector('.sign-in-link');
	const signUpForm = document.querySelector('.login');
	const signInForm = document.querySelector('.register');

	// Chuyển sang form đăng ký
	signUpLink.addEventListener('click', () => {
		signInForm.classList.remove('active');
		signUpForm.classList.add('active');
		clearSignUpForm(); // Xóa dữ liệu trong form đăng ký khi chuyển đổi
	});

	// Chuyển sang form đăng nhập
	signInLink.addEventListener('click', () => {
		signUpForm.classList.remove('active');
		signInForm.classList.add('active');
	});

	// Xóa dữ liệu form đăng ký
	function clearSignUpForm() {
		const inputs = signUpForm.querySelectorAll('input');
		inputs.forEach(input => input.value = '');
	}

	// Khi form đăng ký được submit và thành công, đẩy về form đăng nhập
	document.querySelector('.box2.login').addEventListener('submit', async function (event) {
		event.preventDefault();  // Ngăn chặn việc submit form
		const formData = new FormData(this);
		const jsonData = Object.fromEntries(formData.entries());
		console.log(jsonData);
		const response = await fetch('/signup', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(jsonData)
		});

		const result = await response.json();
		if (result.success) {
			showNotification_C(result.message);

			// Đăng ký thành công: Chuyển về form đăng nhập
			signUpForm.classList.remove('active');
			signInForm.classList.add('active');
			clearSignUpForm(); // Xóa dữ liệu form đăng ký sau khi thành công
		} else {
			// Hiển thị lỗi (nếu có)
			showNotification_f((result.message));
		}
	});

	// Thêm vào file JavaScript (login_signup.js)
	function showNotification_C(message) {
		const notification = document.getElementById('successNotification');
		notification.querySelector('span').textContent = message; // Đặt thông điệp
		notification.classList.remove('hidden');

		// Ẩn thông báo sau 6 giây (6000ms)
		setTimeout(() => {
			notification.classList.add('hidden');
		}, 6000);
	}
	function showNotification_f(message) {
		const notification = document.getElementById('failNotification');
		notification.querySelector('span').textContent = message; // Đặt thông điệp
		notification.classList.remove('hidden');

		// Ẩn thông báo sau 6 giây (6000ms)
		setTimeout(() => {
			notification.classList.add('hidden');
		}, 6000);
	}
});
