// Scent Quiz functionality for Al Qamar Perfumes

class ScentQuiz {
    constructor() {
        this.questions = quizQuestions;
        this.results = quizResults;
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.quizModal = document.getElementById('quiz-modal');
        this.quizContent = document.getElementById('quiz-content');
    }

    startQuiz() {
        this.currentQuestionIndex = 0;
        this.answers = [];
        this.showQuestion();
        this.quizModal.classList.remove('hidden');
        this.quizModal.classList.add('modal-enter');
    }

    showQuestion() {
        if (this.currentQuestionIndex >= this.questions.length) {
            this.showResults();
            return;
        }

        const question = this.questions[this.currentQuestionIndex];
        this.quizContent.innerHTML = `
            <div class="text-center mb-6">
                <div class="text-sm text-[#c0c0c0] mb-2">Question ${this.currentQuestionIndex + 1} of ${this.questions.length}</div>
                <div class="w-full bg-[#0f0f23] rounded-full h-2 mb-4">
                    <div class="bg-[#ffd700] h-2 rounded-full transition-all duration-300" style="width: ${(this.currentQuestionIndex / this.questions.length) * 100}%"></div>
                </div>
            </div>
            <h3 class="text-xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-6 text-center">${question.question}</h3>
            <div class="space-y-3">
                ${question.options.map((option, index) => `
                    <button onclick="scentQuiz.selectAnswer(${index})"
                            class="w-full text-left bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded-lg p-4 hover:border-[#40e0d0] hover:bg-[#40e0d0]/10 transition-all duration-300 transform hover:scale-105">
                        <span class="text-[#c0c0c0]">${option}</span>
                    </button>
                `).join('')}
            </div>
        `;

        // Animate options
        gsap.from('.space-y-3 button', {
            opacity: 0,
            y: 20,
            duration: 0.5,
            stagger: 0.1
        });
    }

    selectAnswer(answerIndex) {
        this.answers.push(answerIndex);

        // Animate selection
        gsap.to(event.target, {
            scale: 0.95,
            duration: 0.1,
            yoyo: true,
            repeat: 1,
            ease: "power2.inOut",
            onComplete: () => {
                this.currentQuestionIndex++;
                this.showQuestion();
            }
        });
    }

    showResults() {
        const resultKey = this.calculateResult();
        const recommendedProducts = this.results[resultKey] || [];

        this.quizContent.innerHTML = `
            <div class="text-center mb-6">
                <div class="text-4xl mb-4">🌙</div>
                <h3 class="text-2xl font-['Crimson_Text'] font-bold text-[#ffd700] mb-4">Your Lunar Scent Profile</h3>
                <p class="text-[#c0c0c0] mb-6">Based on your answers, you have a <span class="text-[#40e0d0] font-semibold">${resultKey.toLowerCase()}</span> scent preference!</p>
            </div>
            <div class="mb-6">
                <h4 class="text-lg font-semibold text-[#ffd700] mb-4">Recommended Scents:</h4>
                <div class="space-y-4 max-h-64 overflow-y-auto">
                    ${recommendedProducts.slice(0, 5).map(productId => {
                        const product = products.find(p => p.id === productId);
                        return product ? `
                            <div class="bg-[#0f0f23]/50 border border-[#ffd700]/20 rounded-lg p-4 flex items-center space-x-4">
                                <img src="${product.image}" alt="${product.name}" class="w-12 h-12 object-cover rounded">
                                <div class="flex-1">
                                    <h5 class="font-semibold text-[#40e0d0]">${product.name}</h5>
                                    <p class="text-sm text-[#c0c0c0]">${product.category} • $${product.price}</p>
                                </div>
                                <button onclick="scentQuiz.addToCart(${product.id})" class="bg-[#ffd700] text-[#0f0f23] px-3 py-1 rounded text-sm font-semibold hover:bg-[#ffd700]/80 transition-colors">
                                    Add
                                </button>
                            </div>
                        ` : '';
                    }).join('')}
                </div>
            </div>
            <div class="flex space-x-4">
                <button onclick="scentQuiz.restartQuiz()" class="flex-1 bg-[#0f0f23] border border-[#ffd700]/20 text-[#c0c0c0] py-3 rounded-lg font-semibold hover:border-[#40e0d0] transition-colors">
                    Retake Quiz
                </button>
                <a href="pages/shop.html" class="flex-1 bg-[#ffd700] text-[#0f0f23] py-3 rounded-lg font-semibold text-center hover:bg-[#ffd700]/80 transition-colors">
                    Shop All Scents
                </a>
            </div>
        `;

        // Animate results
        gsap.from('.space-y-4 > div', {
            opacity: 0,
            x: -20,
            duration: 0.5,
            stagger: 0.1
        });
    }

    calculateResult() {
        // Simple calculation based on most common answer type
        const answerCounts = {};
        this.answers.forEach(answer => {
            const question = this.questions[this.answers.indexOf(answer)];
            const optionText = question.options[answer];
            const category = this.getCategoryFromOption(optionText);
            answerCounts[category] = (answerCounts[category] || 0) + 1;
        });

        const maxCategory = Object.keys(answerCounts).reduce((a, b) =>
            answerCounts[a] > answerCounts[b] ? a : b
        );

        return maxCategory;
    }

    getCategoryFromOption(optionText) {
        // Map options to result categories
        const mappings = {
            "Floral - delicate and feminine": "Floral - delicate and feminine",
            "Woody - earthy and grounding": "Woody - earthy and grounding",
            "Oriental - warm and spicy": "Oriental - warm and spicy",
            "Fresh - clean and invigorating": "Fresh - clean and invigorating"
        };

        // For demo purposes, map based on keywords
        if (optionText.toLowerCase().includes('floral') || optionText.toLowerCase().includes('jasmine') || optionText.toLowerCase().includes('rose')) {
            return "Floral - delicate and feminine";
        } else if (optionText.toLowerCase().includes('woody') || optionText.toLowerCase().includes('forest') || optionText.toLowerCase().includes('cedar')) {
            return "Woody - earthy and grounding";
        } else if (optionText.toLowerCase().includes('oriental') || optionText.toLowerCase().includes('warm') || optionText.toLowerCase().includes('spicy')) {
            return "Oriental - warm and spicy";
        } else {
            return "Fresh - clean and invigorating";
        }
    }

    addToCart(productId) {
        if (window.cartManager) {
            window.cartManager.addToCart(productId);
        } else {
            // Fallback if cart manager not available
            console.log('Adding to cart:', productId);
        }
    }

    restartQuiz() {
        this.startQuiz();
    }

    closeQuiz() {
        this.quizModal.classList.add('hidden');
    }
}

// Initialize scent quiz
const scentQuiz = new ScentQuiz();

// Make globally available
window.scentQuiz = scentQuiz;
