let darkMode = localStorage.getItem('darkMode');


const enableDarkMode = () => {
  document.body.classList.remove('body')
  document.body.classList.add('dark');
  localStorage.setItem('darkMode', 'enabled');
}

const disableDarkMode = () => {
  document.body.classList.remove("dark")
  document.body.classList.add('body');
  localStorage.setItem('darkMode', null);
}
 

if (darkMode === 'enabled') {
  enableDarkMode();
}

if (document.getElementById("dark").checked == true) {
    console.log("darkmode");
   enableDarkMode(); 
}else{
    disableDarkMode();
    console.log("light mode");
}

