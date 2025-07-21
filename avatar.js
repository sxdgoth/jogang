// Avatar System for Metaverse Application

class AvatarRenderer {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/';
        this.currentView = 'front';
        this.loadedSVGs = new Map();
        this.isLoading = false;
    }

    // Load SVG content from GitHub with better error handling
    async loadSVG(filename) {
        if (this.loadedSVGs.has(filename)) {
            return this.loadedSVGs.get(filename);
        }

        try {
            console.log(`Loading SVG: ${this.baseUrl}${filename}`);
            const response = await fetch(this.baseUrl + filename, {
                method: 'GET',
                headers: {
                    'Accept': 'image/svg+xml,*/*'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: Failed to load ${filename}`);
            }
            
            const svgContent = await response.text();
            console.log(`Successfully loaded ${filename}, content length: ${svgContent.length}`);
            
            this.loadedSVGs.set(filename, svgContent);
            return svgContent;
        } catch (error) {
            console.error(`Error loading SVG ${filename}:`, error);
            return null;
        }
    }

    // Get body parts for current view
    getBodyPartsForView(view) {
        const prefix = view === 'front' ? 'front-body-flesh-' : 'back-body-flesh-';
        return [
            `${prefix}Head.svg`,
            `${prefix}CoreBody.svg`,
            `${prefix}LeftUpperArm.svg`,
            `${prefix}LeftLowerArm.svg`,
            `${prefix}LeftHand.svg`,
            `${prefix}RightUpperArm.svg`,
            `${prefix}RightLowerArm.svg`,
            `${prefix}RightHand.svg`,
            `${prefix}LeftUpperLeg.svg`,
            `${prefix}LeftLowerLeg.svg`,
            `${prefix}LeftFoot.svg`,
            `${prefix}RightUpperLeg.svg`,
            `${prefix}RightLowerLeg.svg`,
            `${prefix}RightFoot.svg`
        ];
    }

    // Render complete avatar with improved loading
    async renderAvatar(container, view = 'front') {
        if (this.isLoading) {
            console.log('Avatar is already loading, skipping...');
            return;
        }

        this.isLoading = true;
        this.currentView = view;
        const bodyParts = this.getBodyPartsForView(view);
        
        console.log(`Starting to render avatar in ${view} view`);
        console.log('Body parts to load:', bodyParts);
        
        // Show loading with progress
        container.innerHTML = `
            <div class="avatar-loading">
                <p>Loading your ${view} avatar...</p>
                <div class="loading-progress">
                    <div class="progress-bar"></div>
                </div>
                <p class="loading-status">Preparing...</p>
            </div>
        `;

        try {
            const loadingStatus = container.querySelector('.loading-status');
            const progressBar = container.querySelector('.progress-bar');
            
            // Load all SVG files
            loadingStatus.textContent = 'Loading body parts...';
            const svgPromises = bodyParts.map(async (filename, index) => {
                const svgContent = await this.loadSVG(filename);
                const progress = ((index + 1) / bodyParts.length) * 100;
                progressBar.style.width = `${progress}%`;
                loadingStatus.textContent = `Loading ${filename}... (${index + 1}/${bodyParts.length})`;
                return { filename, content: svgContent };
            });

            const svgResults = await Promise.all(svgPromises);
            console.log('All SVG files loaded:', svgResults.length);

            loadingStatus.textContent = 'Assembling avatar...';

            // Create the avatar display
            const avatarDisplay = document.createElement('div');
            avatarDisplay.className = 'avatar-display';
            
            let successfulLoads = 0;
            
            // Process each SVG
            for (const { filename, content } of svgResults) {
                if (content && content.trim()) {
                    try {
                        // Create a container for this body part
                        const partContainer = document.createElement('div');
                        partContainer.className = `body-part-container ${filename.replace('.svg', '')}`;
                        partContainer.innerHTML = content;
                        
                        // Style the SVG
                        const svgElement = partContainer.querySelector('svg');
                        if (svgElement) {
                            svgElement.style.position = 'absolute';
                            svgElement.style.top = '0';
                            svgElement.style.left = '0';
                            svgElement.style.width = '100%';
                            svgElement.style.height = '100%';
                            svgElement.style.zIndex = successfulLoads;
                        }
                        
                        avatarDisplay.appendChild(partContainer);
                        successfulLoads++;
                        console.log(`Successfully added ${filename} to avatar`);
                    } catch (error) {
                        console.error(`Error processing ${filename}:`, error);
                    }
                } else {
                    console.warn(`No content for ${filename}`);
                }
            }

            console.log(`Successfully loaded ${successfulLoads} out of ${bodyParts.length} body parts`);

            if (successfulLoads > 0) {
                // Replace loading with avatar
                container.innerHTML = '';
                container.appendChild(avatarDisplay);
                
                // Apply customizations
                this.applyCustomizations(container);
                
                console.log('Avatar rendering completed successfully');
            } else {
                throw new Error('No body parts could be loaded');
            }
            
        } catch (error) {
            console.error('Error rendering avatar:', error);
            container.innerHTML = `
                <div class="avatar-error">
                    <p>❌ Error loading avatar</p>
                    <p>Could not load body template from GitHub</p>
                    <p class="error-details">${error.message}</p>
                    <button onclick="avatarRenderer.renderAvatar(document.getElementById('avatar-container'), '${view}')" class="btn-secondary" style="margin-top: 15px;">Try Again</button>
                </div>
            `;
        } finally {
            this.isLoading = false;
        }
    }

    // Apply user customizations
    applyCustomizations(container) {
        const user = getCurrentUser();
        if (!user || !user.avatar.customizations) return;

        const { skinColor } = user.avatar.customizations;
        
        if (skinColor) {
            // Apply skin color to all flesh parts
            const bodyParts = container.querySelectorAll('path, circle, ellipse, rect');
            bodyParts.forEach(part => {
                const currentFill = part.getAttribute('fill');
                if (currentFill && (currentFill.toLowerCase().includes('#f') || currentFill.toLowerCase().includes('flesh'))) {
                    part.setAttribute('fill', skinColor);
                }
            });
        }
    }

    // Switch between front and back view
    async switchView(container, view) {
        if (this.currentView === view || this.isLoading) return;
        
        console.log(`Switching to ${view} view`);
        await this.renderAvatar(container, view);
    }
}

// Global avatar renderer instance
const avatarRenderer = new AvatarRenderer();

// Avatar utility functions
function initializeAvatar() {
    const container = document.getElementById('avatar-container');
    if (!container) {
        console.error('Avatar container not found');
        return;
    }

    const user = getCurrentUser();
    if (!user) {
        console.error('No current user found');
        container.innerHTML = `
            <div class="avatar-error">
                <p>❌ No user logged in</p>
                <p>Please log in to view your avatar</p>
            </div>
        `;
        return;
    }

    console.log('Initializing avatar for user:', user.username);
    
    // Render the avatar
    avatarRenderer.renderAvatar(container, user.avatar.view || 'front');
}

function switchAvatarView(view) {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    console.log(`Switching avatar view to: ${view}`);

    // Update user preference
    const user = getCurrentUser();
    if (user) {
        user.avatar.view = view;
        updateCurrentUser(user);
    }

    // Render new view
    avatarRenderer.switchView(container, view);
    
    // Update button states
    document.querySelectorAll('.view-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`${view}-view`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AvatarRenderer, avatarRenderer };
}