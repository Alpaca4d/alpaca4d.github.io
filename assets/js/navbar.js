document.getElementById("navbar").innerHTML = 
`
<div class="navbar-fixed">
    
    <nav class="white z-depth-0">
      <div class="container">
      <div class="nav-wrapper">
        <!-- <div class="container "> -->
          <a class="sidenav-trigger" href="#" data-target="mobile-demo"><i class="material-icons black-text">menu</i></a>
          <a class="brand-logo black-text" href="./../index.html">Alpaca4d</a>       
          <ul class="right hide-on-med-and-down">
            <li><a class="black-text" style="border-radius:20px;" href="./../about/index.html">About</a></li>
            <li><a class="black-text" style="border-radius:20px;" href="./../download.html">Download</a></li>
            <li><a class="black-text" style="border-radius:20px;" href="https://alpaca4d.gitbook.io/docs">Docs</a></li>
            <li><a class="red darken-2 white-text text-darken-2 btn" style="font-weight:600; border-radius:10px;" href="./../become_a_sponsor.html">Sponsors</a></li>
      <!--  <li><a class="green darken-2 white-text text-darken-2 btn" style="font-weight:600; border-radius:10px;" href="./../workshop.html">Workshop</a></li> -->
          </ul>
      </div>
      </div>
    </nav>
  </div>

  
  
    <ul class="sidenav  indigo darken-2" id="mobile-demo">
      <li><a class="white-text" href="./../about/index.html">About</a></li>
      <li><a class="white-text" href="./../download.html">Download</a></li>
      <li><a class="white-text" href="https://alpaca4d.gitbook.io/docs">Docs</a></li>
  <!-- <li><a class="orange-text text-darken-2" style="font-weight:600" href="./../become_a_sponsor.html">Sponsors</a></li> -->
    </ul>
`