
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

hamburger.addEventListener("click", () => {
	hamburger.classList.toggle("active");
	navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-item").forEach(n => n. addEventListener("click", () => {
	hamburger.classList.remove("active");
	navMenu.classList.remove("active");
}));

 
const propertyForm = document.querySelector("#propertyForm");
const fileUploadBtn = document.querySelector("#fileUploadBtn");
const uploadedImage = document.querySelector("#uploadedImage");
const postBtn = document.querySelector("#postBtn");

if (propertyForm) {
  const readFileAsync = files => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(files[0]);
    fileReader.addEventListener("load", () => {
      const Image = document.createElement("img");
      Image.src = fileReader.result;
      Image.alt = "property";
      Image.setAttribute("class", "ab-img");
      uploadedImage.appendChild(Image);
    });
  };

  fileUploadBtn.addEventListener("change", () => {
    if (uploadedImage.firstChild) {
      uploadedImage.removeChild(uploadedImage.firstChild);
    }
    readFileAsync(fileUploadBtn.files);
  });
  postBtn.addEventListener("click", e => {
    e.preventDefault();
    window.location.replace("mypropertyadverts.html");
  });
};


const viewBtns = document.querySelectorAll(
  ".viewBtn"
);

  viewBtns.forEach((viewBtn) => {
   viewBtn.addEventListener("click", () => {
      window.location.replace("Specific property 1.html");
    });
  });

const updateForm = document.querySelector("#updateForm");
const updateBtn = document.querySelector("#updateBtn");

updateBtn.addEventListener("click", e => {
    e.preventDefault();
	window.location.replace("Specific property 1.html");
   updateForm.classList.add("sp-hide");
  });

var modal = document.getElementById("myModal");
 var btn = document.getElementById("deleteProperty");

 btn.onclick = function() {
  modal.style.display = "block";
 }

  yesBtn.addEventListener("click", e => {
    e.preventDefault();
	window.location.replace("My property list.html");
  });

noBtn.addEventListener("click", e => {
    e.preventDefault();
	window.location.replace("Specific property 1.html");
  });

  window.onclick = function(event) {
  if (event.target == modal) {
   modal.style.display = "none";
  }
 };




//API merge calls

const API_URL = 'http://localhost:5000/api';
const token = localStorage.getItem('token');


async function signup(event) {
  event.preventDefault();
  const name = document.getElementById('signupName').value;
  const email = document.getElementById('signupEmail').value;
  const password = document.getElementById('signupPassword').value;

  try {
      const res = await fetch(`${API_URL}/users/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      alert(data.message);
      if (res.ok) window.location.href = 'Sign In.html';
  } catch (error) {
      console.error('Signup failed:', error);
  }
};


async function signin(event) {
  event.preventDefault();
  const email = document.getElementById('signinEmail').value;
  const password = document.getElementById('signinPassword').value;

  try {
      const res = await fetch(`${API_URL}/users/signin`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
          localStorage.setItem('token', data.token);
          window.location.href = 'dashboard.html';
      } else {
          alert(data.message);
      }
  } catch (error) {
      console.error('Signin failed:', error);
  }
}


async function fetchProperties() {
  try {
      const res = await fetch(`${API_URL}/properties/all`);
      const data = await res.json();
      displayProperties(data);
  } catch (error) {
      console.error('Error fetching properties:', error);
  }
};


document.getElementById('propertyForm')?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append('title', document.getElementById('title').value);
  formData.append('description', document.getElementById('description').value);
  formData.append('price', document.getElementById('price').value);
  formData.append('location', document.getElementById('location').value);
  formData.append('type', document.getElementById('type').value);
  formData.append('image_url', document.getElementById('image').files[0]);

  try {
      const res = await fetch(`${API_URL}/properties/post`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData,
      });

      const data = await res.json();
      alert(data.message);
      fetchUserProperties();
  } catch (error) {
      console.error('Error posting property:', error);
  }
});


function displayProperties(properties) {
  const container = document.getElementById('properties');
  container.innerHTML = '';

  properties.forEach(prop => {
      container.innerHTML += `
          <div class="property">
              <h3>${prop.title}</h3>
              <p>${prop.description}</p>
              <p>Price: $${prop.price}</p>
              <p>Location: ${prop.location}</p>
              <p>Status: ${prop.status}</p>
              <img src="${prop.image_url}" width="200">
              <button onclick="getProperty(${prop.id})">View Details</button>
          </div>
      `;
  });
};


async function updateProperty(id) {
  const newPrice = prompt('Enter new price:');
  if (!newPrice) return;  
  
  try {
      const res = await fetch(`${API_URL}/properties/update/${id}`, {
          method: 'PUT',
          headers: { 
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({  price: newPrice }),
      });

      const data = await res.json();
      alert(data.message);
      fetchUserProperties();
  } catch (error) {
      console.error('Error updating property:', error);
  }
};


async function deleteProperty(id) {
  if (!confirm('Are you sure?')) return;

  try {
      const res = await fetch(`${API_URL}/properties/delete/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();
      alert(data.message);
      fetchUserProperties();
  } catch (error) {
      console.error('Error deleting property:', error);
  }
};


async function getProperty(id) {
  try {
      const res = await fetch(`${API_URL}/properties/${id}`);
      const data = await res.json();
      alert(`Property: ${data.title}\nDescription: ${data.description}`);
  } catch (error) {
      console.error('Error fetching property:', error);
  }
};


async function getPropertyByType(type) {
  try {
      const res = await fetch(`${API_URL}/properties/type/${type}`);
      const data = await res.json();
      alert(`Property: ${data.title}\nType: ${data.type}`);
  } catch (error) {
      console.error('Error fetching property:', error);
  }
};


async function markAsSold(id) {
  try {
      const res = await fetch(`${API_URL}/properties/sold/${id}`, {
          method: 'PATCH',
          headers: { 'Authorization': `Bearer ${token}` },
      });

      const data = await res.json();
      alert(data.message);
      fetchUserProperties();
  } catch (error) {
      console.error('Error marking as sold:', error);
  }
};