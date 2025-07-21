// Avatar System for Metaverse Application

class AvatarRenderer {
    constructor() {
        this.baseUrl = 'https://raw.githubusercontent.com/sxdgoth/jogang/main/template/';
        this.currentView = 'front';
        this.loadedSVGs = new Map();
    }

    // Load SVG content from GitHub
    async loadSVG(filename) {
        if (this.loadedSVGs.has(filename)) {
            return this.loadedSVGs.get(filename);
        }

        try {
            const response = await fetch(this.baseUrl + filename);
            if (!response.ok) {
                throw new Error(`Failed to load ${filename}`);
            }
            const svgContent = await response.text();
            this.loadedSVGs.set(filename, svgContent);
            return svgContent;
        } catch (error) {
            console.error('Error loading SVG:', error);
            return null;
        }
    }

    // Get body parts for current view
    getBodyPartsForView(view) {
        const prefix = view === 'front' ? 'front-body-flesh-' : 'back-body-flesh-';
        return {
            head: `${prefix}Head.svg`,
            coreBody: `${prefix}CoreBody.svg`,
            leftUpperArm: `${prefix}LeftUpperArm.svg`,
            leftLowerArm: `${prefix}LeftLowerArm.svg`,
            leftHand: `${prefix}LeftHand.svg`,
            rightUpperArm: `${prefix}RightUpperArm.svg`,
            rightLowerArm: `${prefix}RightLowerArm.svg`,
            rightHand: `${prefix}RightHand.svg`,
            leftUpperLeg: `${prefix}LeftUpperLeg.svg`,
            leftLowerLeg: `${prefix}LeftLowerLeg.svg`,
            leftFoot: `${prefix}LeftFoot.svg`,
            rightUpperLeg: `${prefix}RightUpperLeg.svg`,
            rightLowerLeg: `${prefix}RightLowerLeg.svg`,
            rightFoot: `${prefix}RightFoot.svg`
        };
    }

    // Render complete avatar
    async renderAvatar(container, view = 'front') {
        this.currentView = view;
        const bodyParts = this.getBodyPartsForView(view);
        
        // Show loading
        container.innerHTML = `
            <div class="avatar-loading">
                <p>Loading your avatar...</p>
            </div>
        `;

        try {
            // Create main SVG container
            const svgContainer = document.createElement('div');
            svgContainer.className = 'avatar-body';
            svgContainer.innerHTML = `
                <svg viewBox="0 0 400 600" xmlns="http://www.w3.org/2000/svg">
                    <g id="avatar-parts"></g>
                </svg>
            `;

            const avatarGroup = svgContainer.querySelector('#avatar-parts');
            
            // Load and combine all body parts
            const partPromises = Object.entries(bodyParts).map(async ([partName, filename]) => {
                const svgContent = await this.loadSVG(filename);
                if (svgContent) {
                    // Extract the path/shape data from the SVG
                    const parser = new DOMParser();
                    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
                    const svgElement = svgDoc.querySelector('svg');
                    
                    if (svgElement) {
                        // Create a group for this body part
                        const partGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                        partGroup.setAttribute('id', partName);
                        partGroup.setAttribute('class', `body-part ${partName}`);
                        
                        // Copy all child elements from the loaded SVG
                        Array.from(svgElement.children).forEach(child => {
                            const clonedChild = child.cloneNode(true);
                            partGroup.appendChild(clonedChild);
                        });
                        
                        avatarGroup.appendChild(partGroup);
                    }
                }
            });

            await Promise.all(partPromises);
            
            // Replace loading with rendered avatar
            container.innerHTML = '';
            container.appendChild(svgContainer);
            
            // Apply any customizations
            this.applyCustomizations(container);
            
        } catch (error) {
            console.error('Error rendering avatar:', error);
            container.innerHTML = `
                <div class="avatar-error">
                    <p>❌ Error loading avatar</p>
                    <p>Please try refreshing the page</p>
                </div>
            `;
        }
    }

    // Apply user customizations
    applyCustomizations(container) {
        const user = getCurrentUser();
        if (!user || !user.avatar.customizations) return;

        const { skinColor } = user.avatar.customizations;
        
        if (skinColor) {
            // Apply skin color to all flesh parts
            const bodyParts = container.querySelectorAll('.body-part path, .body-part circle, .body-part ellipse');
            bodyParts.forEach(part => {
                // Only change flesh-colored parts (you might need to adjust this logic)
                const currentFill = part.getAttribute('fill');
                if (currentFill && (currentFill.includes('#F') || currentFill.includes('flesh'))) {
                    part.setAttribute('fill', skinColor);
                }
            });
        }
    }

    // Switch between front and back view
    async switchView(container, view) {
        if (this.currentView === view) return;
        
        await this.renderAvatar(container, view);
    }
}

// Global avatar renderer instance
const avatarRenderer = new AvatarRenderer();

// Avatar utility functions
function initializeAvatar() {
    const container = document.getElementById('avatar-container');
    if (!container) return;

    const user = getCurrentUser();
    if (!user) return;

    // Render the avatar
    avatarRenderer.renderAvatar(container, user.avatar.view || 'front');
}

function switchAvatarView(view) {
    const container = document.getElementById('avatar-container');
    if (!container) return;

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
    document.getElementById(`${view}-view`).classList.add('active');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AvatarRenderer, avatarRenderer };
}