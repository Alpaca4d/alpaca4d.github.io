// Pin the footer to the bottom of the viewport when a page is short on content,
// and size the inline icons in the Connect row.
document.head.insertAdjacentHTML("beforeend",
`
<style>
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  #footer {
    margin-top: auto;
  }
  #footer .social-icons {
    display: flex;
    align-items: center;
    gap: 14px;
  }
  #footer .social-icons svg {
    width: 24px;
    height: 24px;
    fill: currentColor;
  }
  #footer .social-icons a:hover {
    opacity: 0.6;
  }
</style>
`);

document.getElementById("footer").innerHTML =

`
<footer class="page-footer white z-depth-0">
<div class="divider"></div>
<div class="container">
  <div class="row">
    <div class="col s8">
      <h5 class="black-text">Open Source Project</h5>
      <p  class="black-text">Building the tool for a better and comprehensive design</p>
    </div>
    <div class="col s4">
      <h5 class="black-text">Connect</h5>
      <div class="social-icons">
        <a class="black-text" href="mailto:alpaca4d@gmail.com" title="Email us" aria-label="Email us">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Email</title><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
        </a>
        <a class="black-text" href="https://www.linkedin.com/company/alpaca4d/" title="Alpaca4d on LinkedIn" aria-label="Alpaca4d on LinkedIn" target="_blank" rel="noopener">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>LinkedIn</title><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z"/></svg>
        </a>
        <a class="black-text" href="https://github.com/Alpaca4d/Alpaca4d/issues/new" title="Ask for help on GitHub" aria-label="Ask for help on GitHub" target="_blank" rel="noopener">
          <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>GitHub</title><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
        </a>
      </div>
    </div>
  </div>
</div>

<div class="footer-copyright">
  <div class="container black-text">
    Made with<a class= "orange-text" href="https://en.wikipedia.org/wiki/Love" target="_blank"> ❤️</a>
  </div>
</div>
</footer>
`
