localStorage.token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBlZGllbnRlIjoiNzIxNzQxIiwiaWF0IjoxNTkzMzExNTkwfQ.tDjgauNOSep5KpRb3IBON7QT2sgQCjdeQups6y46kPg"
let usuarios;
//Validación de formulario
let form = document.querySelector('#register_form') 
form.addEventListener("change", check);
function check(){
    if(form.querySelectorAll(':invalid').length == 0)
    {
        let password_first_entry = document.querySelector('#register_form').querySelectorAll('[type="password"]')[0].value;
        let password_confirmation = document.querySelector('#register_form').querySelectorAll('[type="password"]')[1].value;
        if(password_first_entry == password_confirmation){
            document.querySelector('#button_register_h').removeAttribute("disabled",false)
        }
    }
    if(form.querySelectorAll(':invalid').length > 0)
    {
        document.querySelector('#button_register_h').setAttribute("disabled",true)
    }
}

//Registrando usuarios con el submit
function registrar(){
    let genero_resp = document.querySelectorAll("#register_form input")[6].checked == true ? "H": "M";
    let answers = {
        "nombre": "" + document.querySelectorAll("#register_form input")[0].value,
        "apellido":"" + document.querySelectorAll("#register_form input")[1].value,
        "correo":"" + document.querySelectorAll("#register_form input")[2].value,
        "url":"" + document.querySelectorAll("#register_form input")[8].value,
        "sexo":"" + genero_resp,
        "fecha":"" + document.querySelectorAll("#register_form input")[5].value,
        "password":"" + document.querySelectorAll("#register_form input")[3].value
    }
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('POST', "https://users-dasw.herokuapp.com/api/users");
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    // 4. Enviar solicitud a la red 
    let data = JSON.stringify(answers);
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    //console.log(xhr.responseText); // Significa que fue exitoso
    alert("usuario registrado!");
    }};
    event.preventDefault()
    $('#registerModalId').on('hidden.bs.modal', function () {
        // refresh current page
        location.reload();
      })
}

//Obteniendo token con datos del login, previamente registrado
function login(){
    let xhr = new XMLHttpRequest();
    let data_for_login = {
        "correo":""+ document.getElementById("email_r").value,
        "password":""+ document.getElementById("password_r").value}
    // 2. Configurar: PUT actualizar archivo
    xhr.open('POST', "https://users-dasw.herokuapp.com/api/login");
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    // 4. Enviar solicitud a la red 
    let data = JSON.stringify(data_for_login);
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    localStorage.token_user= JSON.parse(xhr.response).token
    window.location.href = "consultas.html"
    console.log(xhr.responseText); // Significa que fue exitoso
    }};
    event.preventDefault()
} 

//Obteniendo token con datos del login, previamente registrado
function searching_users(){
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('GET', "https://users-dasw.herokuapp.com/api/users");
    // 3. indicar tipo de datos JSON 
    //xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    xhr.setRequestHeader('x-user-token',localStorage.token_user);
    // 4. Enviar solicitud a la red 
    xhr.send();
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    //console.log(xhr.responseText); // Significa que fue exitoso
    let users = JSON.parse(xhr.responseText);
    let size = users.length; //Obteniendo cuantos usuarios estan registrados
    usuarios = users; //guardamos los usuarios para usarlos en la de
    //console.log(users[1].correo);
    for (let i = 0; i < size; i++) {
        document.getElementById('users_list_page').insertAdjacentHTML('beforeend',`<div class="media m-3 p-2" style="  border: 1px;  border-style: solid;  border-color: lightgray;  border-radius: 8px;">
        <div class="col-2">
            <div class="media-left w-100%">
                <img  class="mr-3 rounded-circle"  src=${users[i].url}  alt="Generic placeholder image" style="max-height:100%; max-width:100%;"/>
            </div>
        </div>
        <div class="col-8 ml-4">
            <div class="media-body">
                <h5 class="mt-0">${users[i].nombre + " "+ users[i].apellido} </h5>
                <p id="for_edit_user_p">Correo: ${users[i].correo}</p><br/>
            </div>
        </div>
        <div class="col-2">
            <div class="media-right align-self-center justify-content-end">
                <div class="row pb-2 pl-5">
                    <!-- <button class="btn btn-primary"><i class="fas fa-search"></i></button> -->
                    <button onclick="verDetalle(${i})" type="button" class="btn btn-primary"><i class="fas fa-search"></i></button>
                    </div>
                    <div class="row pb-2 pl-5">
                        <a onclick="edit_user('${i}')" class="btn btn-primary" href="#" data-toggle="modal" data-target="#editModalId"><i class="fas fa-pencil-alt "></i></a>
                    </div>
                    <div class="row pl-5">
                        <a onclick="deleteuser_modal('${i}')"class="btn btn-primary" href="#" data-toggle="modal" data-target="#delete_modal1"> <i class="fas fa-trash"></i></a>
                    </div>
                </div>
            </div>
        </div>
        <!-- cards of users -->`)
    }
    }};
} 

//Para editar usuario
function edit_user(number){
    let correo = (usuarios[number].correo); //Obteniendo el correo del usuario a editar, para hacer un get y obtener todos sus datos
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('GET', ("https://users-dasw.herokuapp.com/api/users" +"/"+correo));
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    xhr.setRequestHeader('x-user-token',localStorage.token_user);
    // 4. Enviar solicitud a la red 
    xhr.send();
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    let user = JSON.parse(xhr.responseText);
    console.log(user); 
    //Mostrando los valores del usuario guardados previamente
    document.getElementById('edit_form').getElementsByTagName('input')[0].value=user.nombre;
    document.getElementById('edit_form').getElementsByTagName('input')[1].value=user.apellido;
    document.getElementById('edit_form').getElementsByTagName('input')[2].value=user.correo;
    document.getElementById('edit_form').getElementsByTagName('input')[3].value=user.password;
    document.getElementById('edit_form').getElementsByTagName('input')[4].value=user.password;
    document.getElementById('edit_form').getElementsByTagName('input')[5].value=user.fecha;
    document.getElementById('edit_form').getElementsByTagName('input')[8].value=user.url;
    if(user.sexo == "H"){document.getElementById('edit_form').getElementsByTagName('input')[6].setAttribute("checked", true)}
    if(user.sexo == "M"){document.getElementById('edit_form').getElementsByTagName('input')[7].setAttribute("checked", true)}
    }};
} 

//Toma los valores que se ingresaron para actualizar usuario
function actualizar_usuario(){
    let genero_resp = document.getElementById('edit_form').getElementsByTagName('input')[6].checked == true ? "H": "M";
    if(document.getElementById('edit_form').getElementsByTagName('input')[3].value != document.getElementById('edit_form').getElementsByTagName('input')[4].value){alert("La contraseña no coincide")}
    let answers_for_userUpdate = {
        "nombre": "" + document.getElementById('edit_form').getElementsByTagName('input')[0].value,
        "apellido":"" + document.getElementById('edit_form').getElementsByTagName('input')[1].value,
        "correo":"" + document.getElementById('edit_form').getElementsByTagName('input')[2].value,
        "url":"" + document.getElementById('edit_form').getElementsByTagName('input')[8].value,
        "sexo":"" + genero_resp,
        "fecha":"" + document.getElementById('edit_form').getElementsByTagName('input')[5].value,
        "password":"" + document.getElementById('edit_form').getElementsByTagName('input')[3].value
    }
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('PUT', ("https://users-dasw.herokuapp.com/api/users"+"/"+document.getElementById('edit_form').getElementsByTagName('input')[2].value));
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    xhr.setRequestHeader('x-user-token',localStorage.token_user);
    // 4. Enviar solicitud a la red 
    let data = JSON.stringify(answers_for_userUpdate);
    xhr.send(data);
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    console.log(xhr.responseText);
    alert("usuario actualizado!") // Significa que fue exitoso
    }};
    event.preventDefault()
    $('#editModalId').on('hidden.bs.modal', function () {
        // refresh current page
        location.reload();
      })
}

function deleteuser_modal(number){
    document.getElementById('name_for_del').innerText = usuarios[number].nombre + " " + usuarios[number].apellido;
    document.getElementById('email_for_del').innerText = usuarios[number].correo;
}

function deleteuser(){
    let correo = document.getElementById('email_for_del').innerText; //Obteniendo el correo del usuario a editar, para hacer un get y obtener todos sus datos
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('DELETE', ("https://users-dasw.herokuapp.com/api/users" +"/"+correo));
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    xhr.setRequestHeader('x-user-token',localStorage.token_user);
    // 4. Enviar solicitud a la red 
    xhr.send();
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    console.log(xhr.responseText);
    alert("usuario eliminado!") // Significa que fue exitoso
    }};
    event.preventDefault()
    $('#delete_modal1').on('hidden.bs.modal', function () {
        // refresh current page
        location.reload();
      })
}

function verDetalle(number){
    localStorage.user_detail_email = (usuarios[number].correo);
    window.location.href="detalle.html";
}

//user_detail_content
function verDetalle_load(){
    let xhr = new XMLHttpRequest();
    // 2. Configurar: PUT actualizar archivo
    xhr.open('GET', ("https://users-dasw.herokuapp.com/api/users" +"/"+localStorage.user_detail_email));
    // 3. indicar tipo de datos JSON 
    xhr.setRequestHeader('Content-Type', 'application/json'); 
    xhr.setRequestHeader('x-auth',localStorage.token); 
    xhr.setRequestHeader('x-user-token',localStorage.token_user);
    // 4. Enviar solicitud a la red 
    xhr.send();
    // 5. Una vez recibida la respuesta del servidor
    xhr.onload = function () {
    if (xhr.status != 200) { // analizar el estatus de la respuesta HTTP // Ocurrió un error
        alert(xhr.status + ': ' + xhr.statusText); // e.g. 404: Not Found
    } else {
    let usuario = JSON.parse(xhr.responseText)
    console.log(usuario);
    document.getElementById('user_detail_content').insertAdjacentHTML('beforeend',`
    <img  class="mr-3 rounded-circle"  src=${usuario.url}  alt="Generic placeholder image" style="max-height:100%; max-width:100%;"/>
    <h1>${usuario.nombre + " " + usuario.apellido}</h1>
    <p>correo: ${usuario.correo}</p>
    <p>sexo: ${usuario.sexo}</p>
    <p>fecha: ${usuario.fecha}</p>
    <p>url de imagen: ${usuario.url}</p>
    `
    )
    }}

}