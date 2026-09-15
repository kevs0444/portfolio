const fs = require('fs');
let content = fs.readFileSync('d:\\Dev\\portfolio\\app\\page.tsx', 'utf8');

const regex = /\{timelinePreview\.credentialId && timelinePreview\.credentialUrl && \([\s\S]*?\}\)/;

const newHeader = `{timelinePreview.credentialId && timelinePreview.credentialUrl && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                        <a href={timelinePreview.credentialUrl} target="_blank" rel="noreferrer" className="button button--ghost" style={{ minHeight: '32px', padding: '0 0.85rem', fontSize: '0.75rem', borderRadius: '6px' }}>
                          <span>Verify Credential</span>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="12" height="12"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" /></svg>
                        </a>
                        <p style={{ fontSize: '0.75rem', color: 'var(--muted)', margin: 0, fontFamily: 'monospace' }} title={timelinePreview.credentialId}>ID: {timelinePreview.credentialId}</p>
                      </div>
                    )}`;

content = content.replace(regex, newHeader);
fs.writeFileSync('d:\\Dev\\portfolio\\app\\page.tsx', content, 'utf8');
console.log("Updated header layout");

