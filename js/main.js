<script src="api.js"></script>

// Estado global da aplicação
const AppState = {
    currentSize: 1652,
    totalDonations: 0,
    currentVisual: 'default',
    donations: [],
    goals: {
        default: { name: 'Bilau', size: 0, unlocked: true },
        aquatico: { name: 'Bilau Aquático', size: 500, unlocked: true },
        cowboy: { name: 'Bilau Cowboy', size: 1000, unlocked: true },
        ballz: { name: 'Bilau Ball Z', size: 1500, unlocked: true },
        saiyajin: { name: 'Bilau Super Saiyajin', size: 2000, unlocked: false },
        unknown1: { name: '????', size: null, unlocked: false },
        unknown2: { name: '????', size: null, unlocked: false },
        unknown3: { name: '????', size: null, unlocked: false }
    }
};

// Configurações da API
const API_CONFIG = {
    BASE_URL: 'https://bilau-backend.onrender.com/api',
    // Para desenvolvimento local, descomente a linha abaixo:
    // BASE_URL: 'http://localhost:3000/api'
};

// Utilitários
const Utils = {
    // Formatar moeda brasileira
    formatCurrency(amount) {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(amount);
    },

    // Formatar número com separadores de milhares
    formatNumber(num) {
        return new Intl.NumberFormat('pt-BR').format(num);
    },

    // Debounce para otimizar chamadas de API
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Gerar ID único
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validar email
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    // Sanitizar string para HTML
    sanitizeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
};

// Sistema de notificações Toast
const Toast = {
    container: null,

    init() {
        this.container = document.getElementById('toast-container');
    },

    show(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div>${Utils.sanitizeHtml(message)}</div>
        `;

        this.container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            if (toast.parentNode) {
                toast.style.animation = 'toastOut 0.3s ease forwards';
                setTimeout(() => {
                    if (toast.parentNode) {
                        this.container.removeChild(toast);
                    }
                }, 300);
            }
        }, duration);

        return toast;
    },

    success(message, duration = 3000) {
        return this.show(message, 'success', duration);
    },

    error(message, duration = 5000) {
        return this.show(message, 'error', duration);
    },

    warning(message, duration = 4000) {
        return this.show(message, 'warning', duration);
    }
};

// Gerenciador de dados do Bilau
const BilauManager = {
    // Atualizar tamanho atual
    updateSize(newSize, animate = true) {
        AppState.currentSize = newSize;
        const sizeElement = document.getElementById('current-size');
        
        if (animate) {
            // Animação de contagem
            const startSize = parseInt(sizeElement.textContent.replace(/\D/g, ''));
            const duration = 1000;
            const steps = 30;
            const increment = (newSize - startSize) / steps;
            let currentStep = 0;

            const timer = setInterval(() => {
                currentStep++;
                const displaySize = Math.round(startSize + (increment * currentStep));
                sizeElement.textContent = Utils.formatNumber(displaySize) + ' cm';

                if (currentStep >= steps) {
                    clearInterval(timer);
                    sizeElement.textContent = Utils.formatNumber(newSize) + ' cm';
                    this.updateProgressBar(newSize);
                    this.checkGoalUnlocks(newSize);
                }
            }, duration / steps);
        } else {
            sizeElement.textContent = Utils.formatNumber(newSize) + ' cm';
            this.updateProgressBar(newSize);
        }
    },

    // Atualizar barra de progresso
    updateProgressBar(size) {
        const progressBar = document.getElementById('progress-fill');
        const nextGoal = this.getNextGoal(size);
        
        if (nextGoal) {
            const percentage = (size / nextGoal.size) * 100;
            progressBar.style.width = Math.min(percentage, 100) + '%';
        } else {
            progressBar.style.width = '100%';
        }
    },

    // Obter próxima meta
    getNextGoal(currentSize) {
        const goals = Object.values(AppState.goals)
            .filter(goal => goal.size !== null && goal.size > currentSize)
            .sort((a, b) => a.size - b.size);
        
        return goals.length > 0 ? goals[0] : null;
    },

    // Verificar desbloqueio de metas
    checkGoalUnlocks(size) {
        Object.keys(AppState.goals).forEach(key => {
            const goal = AppState.goals[key];
            if (goal.size !== null && size >= goal.size && !goal.unlocked) {
                goal.unlocked = true;
                this.unlockGoal(key, goal);
            }
        });
    },

    // Desbloquear meta
    unlockGoal(key, goal) {
        const goalElement = document.querySelector(`[data-visual="${key}"]`);
        if (goalElement) {
            goalElement.classList.remove('locked');
            goalElement.classList.add('unlocked');
            Toast.success(`🎉 Nova meta desbloqueada: ${goal.name}!`, 5000);
        }
    },

    // Trocar visual do Bilau
    changeVisual(visualKey) {
        const goal = AppState.goals[visualKey];
        if (!goal || !goal.unlocked) {
            Toast.warning('Esta meta ainda não foi desbloqueada!');
            return;
        }

        AppState.currentVisual = visualKey;
        const bilauGif = document.getElementById('bilau-gif');
        const newSrc = `./assets/images/bilau-${visualKey}.gif`;
        
        // Atualizar imagem com fade
        bilauGif.style.opacity = '0.5';
        setTimeout(() => {
            bilauGif.src = newSrc;
            bilauGif.style.opacity = '1';
        }, 300);

        // Atualizar visual ativo na sidebar
        document.querySelectorAll('.goal-item').forEach(item => {
            item.classList.remove('active');
        });
        document.querySelector(`[data-visual="${visualKey}"]`).classList.add('active');

        Toast.success(`Visual alterado para: ${goal.name}`);
    }
};

// Gerenciador de Cards de Doadores
const CardsManager = {
    container: null,

    init() {
        this.container = document.getElementById('cards-background');
    },

    // Adicionar novo card
    addCard(donation) {
        const card = document.createElement('div');
        card.className = `donor-card ${this.getCardType(donation.amount)} fade-in`;
        card.innerHTML = `
            <div class="donor-name">${Utils.sanitizeHtml(donation.name)}</div>
            <div class="donation-text">Ajudou o bilau a crescer ${donation.centimeters} cm!</div>
        `;

        // Inserir na posição correta (ordenado por valor)
        const existingCards = Array.from(this.container.children);
        let insertPosition = existingCards.length;

        for (let i = 0; i < existingCards.length; i++) {
            const cardAmount = this.getCardAmount(existingCards[i]);
            if (donation.amount > cardAmount) {
                insertPosition = i;
                break;
            }
        }

        if (insertPosition === existingCards.length) {
            this.container.appendChild(card);
        } else {
            this.container.insertBefore(card, existingCards[insertPosition]);
        }

        // Adicionar ao estado
        AppState.donations.push(donation);
        
        return card;
    },

    // Obter tipo de card baseado no valor
    getCardType(amount) {
        if (amount >= 200) return 'custom';
        if (amount >= 50) return 'red';
        if (amount >= 10) return 'yellow';
        return 'green';
    },

    // Obter valor do card (para ordenação)
    getCardAmount(cardElement) {
        const text = cardElement.querySelector('.donation-text').textContent;
        const match = text.match(/(\d+)\s*cm/);
        return match ? parseInt(match[1]) : 0;
    },

    // Carregar cards existentes
    async loadCards() {
        try {
            const donations = await API.getDonations();
            donations.forEach(donation => {
                this.addCard(donation);
            });
        } catch (error) {
            console.error('Erro ao carregar cards:', error);
        }
    },

    // Atualizar card customizado
    updateCustomCard(donationId, customImageUrl) {
        const donation = AppState.donations.find(d => d.id === donationId);
        if (!donation) return;

        const cards = Array.from(this.container.children);
        const cardIndex = AppState.donations.indexOf(donation);
        
        if (cards[cardIndex]) {
            const card = cards[cardIndex];
            card.style.backgroundImage = `url(${customImageUrl})`;
            card.style.backgroundSize = 'cover';
            card.style.backgroundPosition = 'center';
        }
    }
};

// Sistema de formulário de doação
const DonationForm = {
    form: null,
    nameInput: null,
    amountInput: null,
    customDesignInput: null,
    emailInput: null,
    premiumFields: null,

    init() {
        this.form = document.getElementById('donation-form');
        this.nameInput = document.getElementById('donor-name');
        this.amountInput = document.getElementById('donation-amount');
        this.customDesignInput = document.getElementById('custom-design');
        this.emailInput = document.getElementById('donor-email');
        this.premiumFields = document.getElementById('premium-fields');

        this.setupEventListeners();
    },

    setupEventListeners() {
        // Monitorar mudanças no valor para mostrar campos premium
        this.amountInput.addEventListener('input', Utils.debounce(() => {
            this.togglePremiumFields();
        }, 300));

        // Validação em tempo real
        this.nameInput.addEventListener('input', () => {
            this.validateName();
        });

        this.emailInput.addEventListener('input', () => {
            this.validateEmail();
        });

        // Submit do formulário
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    },

    // Alternar campos premium
    togglePremiumFields() {
        const amount = parseFloat(this.amountInput.value) || 0;
        
        if (amount >= 200) {
            this.premiumFields.style.display = 'block';
            this.customDesignInput.required = true;
            this.emailInput.required = true;
        } else {
            this.premiumFields.style.display = 'none';
            this.customDesignInput.required = false;
            this.emailInput.required = false;
            this.customDesignInput.value = '';
            this.emailInput.value = '';
        }
    },

    // Validar nome
    validateName() {
        const name = this.nameInput.value.trim();
        const isValid = name.length >= 2 && name.length <= 50;
        
        this.setFieldValidation(this.nameInput, isValid, 
            isValid ? '' : 'Nome deve ter entre 2 e 50 caracteres');
        
        return isValid;
    },

    // Validar email
    validateEmail() {
        const email = this.emailInput.value.trim();
        const isValid = !email || Utils.validateEmail(email);
        
        this.setFieldValidation(this.emailInput, isValid,
            isValid ? '' : 'Email inválido');
        
        return isValid;
    },

    // Definir validação do campo
    setFieldValidation(field, isValid, message) {
        field.classList.toggle('invalid', !isValid);
        
        // Remover mensagem anterior
        const existingError = field.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }

        // Adicionar nova mensagem se inválido
        if (!isValid && message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.style.color = '#F44336';
            errorDiv.style.fontSize = '0.8em';
            errorDiv.style.marginTop = '5px';
            errorDiv.textContent = message;
            field.parentNode.appendChild(errorDiv);
        }
    },

    // Validar formulário completo
    validateForm() {
        const name = this.nameInput.value.trim();
        const amount = parseFloat(this.amountInput.value) || 0;
        const email = this.emailInput.value.trim();
        const customDesign = this.customDesignInput.value.trim();

        let isValid = true;
        const errors = [];

        // Validar nome
        if (!name || name.length < 2 || name.length > 50) {
            errors.push('Nome deve ter entre 2 e 50 caracteres');
            isValid = false;
        }

        // Validar valor
        if (amount < 1) {
            errors.push('Valor mínimo é R$ 1,00');
            isValid = false;
        }

        if (amount > 10000) {
            errors.push('Valor máximo é R$ 10.000,00');
            isValid = false;
        }

        // Validar campos premium se necessário
        if (amount >= 200) {
            if (!customDesign) {
                errors.push('Descrição do card customizado é obrigatória');
                isValid = false;
            }

            if (!email || !Utils.validateEmail(email)) {
                errors.push('Email válido é obrigatório para cards customizados');
                isValid = false;
            }
        }

        return { isValid, errors };
    },

    // Processar envio do formulário
    async handleSubmit() {
        const validation = this.validateForm();
        
        if (!validation.isValid) {
            validation.errors.forEach(error => {
                Toast.error(error);
            });
            return;
        }

        const donationData = {
            name: this.nameInput.value.trim(),
            amount: parseFloat(this.amountInput.value),
            centimeters: Math.round(parseFloat(this.amountInput.value)),
            customDesign: this.customDesignInput.value.trim() || null,
            email: this.emailInput.value.trim() || null
        };

        try {
            // Desabilitar botão durante processamento
            const submitBtn = this.form.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Processando...';

            // Criar doação via API
            const result = await API.createDonation(donationData);
            
            // Fechar modal de doação
            Modal.hide('donation-modal');
            
            // Mostrar QR code
            Payment.showQRCode(result.pixCode, result.amount, result.donationId);

        } catch (error) {
            console.error('Erro ao criar doação:', error);
            Toast.error('Erro ao processar doação. Tente novamente.');
        } finally {
            const submitBtn = this.form.querySelector('.submit-btn');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Seguir ao pagamento';
        }
    },

    // Resetar formulário
    reset() {
        this.form.reset();
        this.premiumFields.style.display = 'none';
        this.customDesignInput.required = false;
        this.emailInput.required = false;
        
        // Remover mensagens de erro
        this.form.querySelectorAll('.error-message').forEach(msg => {
            msg.remove();
        });
        
        // Remover classes de validação
        this.form.querySelectorAll('.invalid').forEach(field => {
            field.classList.remove('invalid');
        });
    }
};

// Inicialização da aplicação
const App = {
    async init() {
        try {
            // Mostrar loading
            this.showLoading(true);

            // Inicializar componentes
            Toast.init();
            CardsManager.init();
            DonationForm.init();
            Modal.init();
            Payment.init();

            // Configurar event listeners
            this.setupEventListeners();

            // Carregar dados iniciais
            await this.loadInitialData();

            // Ocultar loading
            this.showLoading(false);

            console.log('App inicializado com sucesso!');

        } catch (error) {
            console.error('Erro na inicialização:', error);
            this.showLoading(false);
            Toast.error('Erro ao carregar aplicação. Recarregue a página.');
        }
    },

    setupEventListeners() {
        // Botão principal de doação
        document.getElementById('donate-btn').addEventListener('click', () => {
            Modal.show('donation-modal');
            DonationForm.reset();
        });

        // Troca de visual do bilau
        document.querySelectorAll('.goal-item').forEach(item => {
            item.addEventListener('click', () => {
                const visual = item.getAttribute('data-visual');
                if (!item.classList.contains('locked')) {
                    BilauManager.changeVisual(visual);
                }
            });
        });

        // Verificar pagamentos pendentes periodicamente
        setInterval(() => {
            this.checkPendingPayments();
        }, 30000); // A cada 30 segundos
    },

    async loadInitialData() {
        try {
            // Carregar estatísticas do bilau
            const stats = await API.getBilauStats();
            BilauManager.updateSize(stats.currentSize, false);
            
            // Carregar cards de doadores
            await CardsManager.loadCards();

            // Atualizar metas baseadas no tamanho atual
            BilauManager.checkGoalUnlocks(stats.currentSize);

        } catch (error) {
            console.error('Erro ao carregar dados iniciais:', error);
            // Usar dados padrão se API falhar
            BilauManager.updateSize(AppState.currentSize, false);
        }
    },

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.style.display = 'flex';
        } else {
            loading.style.display = 'none';
        }
    },

    async checkPendingPayments() {
        try {
            const pendingPayments = JSON.parse(localStorage.getItem('pendingPayments') || '[]');
            
            for (const paymentId of pendingPayments) {
                const status = await API.checkPaymentStatus(paymentId);
                
                if (status.confirmed) {
                    // Remover da lista de pendentes
                    const updatedPending = pendingPayments.filter(id => id !== paymentId);
                    localStorage.setItem('pendingPayments', JSON.stringify(updatedPending));
                    
                    // Atualizar interface
                    this.handlePaymentConfirmed(status.donation);
                }
            }
        } catch (error) {
            console.error('Erro ao verificar pagamentos:', error);
        }
    },

    handlePaymentConfirmed(donation) {
        // Adicionar card
        CardsManager.addCard(donation);
        
        // Atualizar tamanho do bilau
        const newSize = AppState.currentSize + donation.centimeters;
        BilauManager.updateSize(newSize);
        
        // Mostrar notificação
        Toast.success(`🎉 Pagamento confirmado! Obrigado ${donation.name}!`, 5000);
        
        // Fechar modal de QR se estiver aberto
        Modal.hide('qr-modal');
        
        // Mostrar modal de confirmação
        Modal.show('payment-modal');
    }
};

// Inicializar quando DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}

// Adicionar CSS para validação
const validationCSS = `
.invalid {
    border-color: #F44336 !important;
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1) !important;
}

.error-message {
    color: #F44336;
    font-size: 0.8em;
    margin-top: 5px;
}
`;

const style = document.createElement('style');
style.textContent = validationCSS;
document.head.appendChild(style);