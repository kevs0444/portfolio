const fs = require('fs');
let code = fs.readFileSync('app/page.tsx', 'utf8');

const sidebarHtml = \
        {/* Left Sidebar (Desktop Only) */}
        <aside className="site-sidebar">
          <div className="sidebar-header">
            <h2>Mar Kevin Alcantara</h2>
            <p>Data Analyst & Scientist</p>
          </div>

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#overview">
              <span className="sidebar-icon">🏠</span> Overview
            </a>
            <a className="sidebar-link" href="#career-graph">
              <span className="sidebar-icon">📈</span> Career Graph
            </a>
            <a className="sidebar-link" href="#projects">
              <span className="sidebar-icon">📂</span> Projects
            </a>
            <a className="sidebar-link" href="#stack">
              <span className="sidebar-icon">🛠️</span> Data Stack
            </a>
          </div>

          <div className="sidebar-divider" />

          <div className="sidebar-nav-group">
            <a className="sidebar-link" href="#assistant">
              <span className="sidebar-icon">🤖</span> Kevs AI
            </a>
            <a className="sidebar-link" href="#contact">
              <span className="sidebar-icon">✉️</span> Contact
            </a>
          </div>

          <div className="sidebar-divider" />
          
          <div className="sidebar-nav-group">
            <button
              type="button"
              className="sidebar-link sidebar-theme-toggle"
              onClick={() => setTheme((current) => (current === 'dark' ? 'light' : 'dark'))}
            >
              <ThemeIcon mode={theme} />
              <span style={{ marginLeft: '0.5rem' }}>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
            </button>
          </div>

          <div className="sidebar-footer">
            <p className="sidebar-footer-title">Reach me at</p>
            <a href="mailto:markevinalcantara40@gmail.com" className="sidebar-email">
              markevinalcantara40@gmail.com
            </a>
          </div>
        </aside>

        <div className="main-area">
\;

code = code.replace('<header className="site-header">', sidebarHtml + '\\n          {/* Site Header / Navigation (Mobile Only) */}\\n          <header className="site-header">');
code = code.replace('</footer>\\r\\n      </div>\\r\\n    </>\\r\\n  );', '</footer>\\r\\n        </div>\\r\\n      </div>\\r\\n    </>\\r\\n  );');
code = code.replace('</footer>\\n      </div>\\n    </>\\n  );', '</footer>\\n        </div>\\n      </div>\\n    </>\\n  );');

fs.writeFileSync('app/page.tsx', code);
console.log('done');
