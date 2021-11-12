<template>
    <main>
        <div class="logo_container">
            <img  src="../assets/logo.svg" alt="logo_groupomania"/>
        </div>
        <div id="signup_container" class="container">
            <div class="form_container">
                <h1>Inscrivez-vous</h1>
                <form @submit.prevent="signup" class="form">
                    <div v-on:click = "changeColor" class="input_container">
                        <input :class="{ active: isActive }" id="lastname" v-model="lastName" type="text" name="lastname" placeholder="Nom" aria-label="Nom" required/>
                        <input :class="{ active: isActive }" id="firstname" v-model="firstName" type="text" name="firstname" placeholder="Prénom" aria-label="Prénom" required/>
                        <input id="email" v-model="email" type="email" name="email" placeholder="Email" aria-label="Email" required/>
                        <input id="password" v-model="password" type="password" name="password" placeholder="Mot de passe" aria-label="Mot de passe" required/>
                    </div>
                    <p v-if="error.length > 0" class="error_message">{{error}}</p>
                    <div class="send_container">
                        <button class="button" type="submit">Inscription</button>
                        <p>Vous avez déjà un compte ? <a href="/#/" class="link">Connectez-vous</a></p>
                    </div>
                </form>
            </div>
        </div>
    </main>
</template>

<script>
    export default {
        name: "SignUp",
        data() {
            return {
            lastName: 'lehis',    
            firstName: 'cecilia',
            email: 'cecilia.lehis@gmail.com',
            password: 'Testmdp20p',
            error: '',
            isActive: false
            }
            
        },
        methods: {
            changeColor(event) {
                console.log(event);
                switch(event.srcElement.id)
                {
                    case "lastname" : console.log("lastname");
                    this.isActive = !this.isActive;
                    break;
                    case "firstname" : console.log("firstame");
                    this.isActive = !this.isActive;
                    break;
                }
            },
            signup(){
                const user = {
                    "lastName": this.lastName,
                    "firstName": this.firstName,
                    "email": this.email,
                    "password": this.password
                }
                console.log(user);
                if (user.lastName && user.firstName && user.email && user.password) {
                    const requestOptions = {
                        // mode: 'no-cors',
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(user)
                    }
                    console.log(requestOptions);
                    fetch("http://localhost:3000/api/user/signup", requestOptions)
                    .then(response => response.json())
                    .then((data) => {
                            if (data.userId && data.token) {
                                localStorage.setItem("userId", data.userId)
                                localStorage.setItem("token", data.token)
                                this.$router.push("posts");
                            } else {
                                this.error = data.message;
                            }
                        })
                    .catch(error => console.log(error))
                }
            }
        },
        mounted() {
            localStorage.clear();
        }
    };

    //Adapter l'élement à la hauteur de la page de l'utilisateur
    function adaptToWindowSize(){
        var width = document.documentElement.clientWidth,
        height = document.documentElement.clientHeight;
    
        var source = document.getElementById('signup_container');
        source.style.height = height+'px';
        source.style.width = width+'px';
    }

    // Une fonction de compatibilité pour gérer les évènements
    function addEvent(element, type, listener){
    if(element.addEventListener){
        element.addEventListener(type, listener, false);
    }else if(element.attachEvent){
        element.attachEvent("on"+type, listener);
    }
    }
 
    // On exécute la fonction une première fois au chargement de la page
    addEvent(window, "load", adaptToWindowSize);
    // Puis à chaque fois que la fenêtre est redimensionnée
    addEvent(window, "resize", adaptToWindowSize);
</script>

<style>
.blueColor {
    color:blue;
    background-color:lightblue;
}
.redColor {
    color:red;
    background-color:lightcoral;
}
    </style>