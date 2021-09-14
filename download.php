<?php include 'sendemail.php'; ?>

<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Responsive Contact Form</title>
    <link rel="stylesheet" href="main_Alpaca4d.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.13.1/css/all.min.css">
  </head>
  <body>


    <ul>
        <li id="index" style="float:left"><a href="index.html">Alpaca4d</a></li>

        <li id="examples" style="float:right"><a href="examples.html">Examples</a></li>
        <li id="download" style="float:right"><a href='download.html'>Download</a></li>
        <!-- <li id="about" style="float:right"><a href="about.html">About</a></li> -->
      </ul>



    <!--contact section start-->
    <div class="contact-section">

      <div class="contact-form">
        <h2>Contact Us</h2>
        <form class="contact" action="" method="post">
          <input type="text" name="name" class="text-box" placeholder="Your Name" required>
          <input type="email" name="email" class="text-box" placeholder="Your Email" required>
          <input type="submit" name="submit" class="send-btn" value="Download">
        </form>
      </div>
    </div>
    <!--contact section end-->

    <script type="text/javascript">
    if(window.history.replaceState){
      window.history.replaceState(null, null, window.location.href);
    }
    </script>

  </body>
</html>