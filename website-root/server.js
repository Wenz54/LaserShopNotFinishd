// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const xss = require('xss');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const fs = require('fs');

const app = express();

// Использование Helmet для установки заголовков безопасности
app.use(helmet());

// Ограничение количества запросов
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 минута
    max: 300 // ограничение каждого IP до 300 запросов за окно
});
app.use(limiter);

// Включение CORS с ограничениями
app.use(cors({
    origin: 'http://localhost:3000', // Укажите ваш домен
    methods: 'GET,POST',
    allowedHeaders: 'Content-Type,Authorization'
}));

// Использование body-parser для обработки JSON с увеличенным лимитом
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }));

// Использование cookie-parser для работы с куками
app.use(cookieParser());

// Установка папки со статическими файлами
app.use(express.static(path.join(__dirname, 'cart-js', 'build')));

// Подключение к MongoDB с правами только для чтения
async function connectToMongo() {
  try {
    await mongoose.connect('mongodb://localhost:27017/Laser', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1); // Выход из процесса при ошибке подключения
  }
}

connectToMongo();

// Определение схем и моделей
const gerbStuffSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'gerbStuff' });

const metalSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'metalStuff' });

const tablesSizesSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'tablesStuffFasad' });

const tabelsOfficeSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'tabelsStuffOffice' });

const osnastkiSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'osnastki' });

const individSchema = new mongoose.Schema({
    name: String,
    artikul: String,
    price: Number,
    imageUrl: String,
    desc: String,
}, { collection: 'businessStuff' });

const GerbStuff = mongoose.model('GerbStuff', gerbStuffSchema);
const TablesSizes = mongoose.model('TablesSizes', tablesSizesSchema);
const TabelsSizesOffice = mongoose.model('TabelsSizesOffice', tabelsOfficeSchema);
const Osnastki = mongoose.model('Osnastki', osnastkiSchema);
const Metal = mongoose.model('Metal', metalSchema);
const Business = mongoose.model('Business', individSchema);

// Настройка хранилища для multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    dest: 'uploads/',
    limits: { fileSize: 25 * 1024 * 1024 } // Ограничение размера файла до 25MB
});

// Маршрут для загрузки изображения
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    res.status(200).json({ imageUrl: `/uploads/${req.file.filename}` });
});

// Установка папки со статическими файлами для загрузок
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Валидация и очистка данных
const sanitizeInput = (input) => {
    return xss(input);
};

app.post('/api/add-to-cart', async (req, res) => {
    console.log('Request received:', req.body); // Логирование запроса
    const { artikul, quantity } = req.body;
    try {
        const sanitizedArtikul = sanitizeInput(artikul);
        const sanitizedQuantity = sanitizeInput(quantity);

        // Сначала ищем в коллекции gerbStuff
        let product = await GerbStuff.findOne({ artikul: sanitizedArtikul });
        
        // Если не найдено, ищем в других коллекциях
        if (!product) product = await TablesSizes.findOne({ artikul: sanitizedArtikul });
        if (!product) product = await Business.findOne({ artikul: sanitizedArtikul });
        if (!product) product = await TabelsSizesOffice.findOne({ artikul: sanitizedArtikul });
        if (!product) product = await Osnastki.findOne({ artikul: sanitizedArtikul });
        if (!product) product = await Metal.findOne({ artikul: sanitizedArtikul });

        // Если товар не найден ни в одной из коллекций, возвращаем 404
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Возвращаем найденный товар и количество
        res.status(200).json({ ...product.toObject(), quantity: sanitizedQuantity });
    } catch (error) {
        console.error('Error adding product to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Функция для генерации уникального пятизначного номера заказа
function generateOrderNumber() {
    return Math.floor(10000 + Math.random() * 90000);
}

// Функция для форматирования текущей даты и времени
function formatDateTime(date) {
    const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    };
    return new Intl.DateTimeFormat('ru-RU', options).format(date);
}

const orderNumber = generateOrderNumber();
const dateTime = formatDateTime(new Date());

// Маршрут для отправки email с прикрепленными файлами
app.post('/send-email', upload.array('files'), (req, res) => {
    const { formData, cart } = req.body;
    const files = req.files;

    console.log('Form Data received:', formData); // Добавьте это для проверки
    console.log('Cart received:', cart); // Добавьте это для проверки
    console.log('Files received:', files); // Добавьте это для проверки

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'lasergraficsomsk@gmail.com',
            pass: 'leab jpht vxwg nipd'
        }
    });


    const parsedFormData = JSON.parse(formData);
    const parsedCart = JSON.parse(cart);

    const cartDetails = parsedCart.map(item => `${item.name} - ${item.quantity} шт. - ${item.price * item.quantity}p`).join('\n');

    const mailOptions = {
        from: 'lasergraficsomsk@gmail.com',
        to: 'wenz5455@gmail.com',
        subject: `Заказ номер ${orderNumber} от ${dateTime}`,
        text: `Имя покупателя: ${parsedFormData.name}\nEmail: ${parsedFormData.email}\nТелефон: ${parsedFormData.phone}\n\nКорзина:\n${cartDetails}`,
        attachments: files.map(file => ({
            filename: file.originalname,
            path: file.path
        }))
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }

        // Очистка папки "uploads" после успешной отправки письма
        const uploadDir = path.join(__dirname, 'uploads');
        fs.readdir(uploadDir, (err, files) => {
            if (err) throw err;

            for (const file of files) {
                fs.unlink(path.join(uploadDir, file), err => {
                    if (err) throw err;
                });
            }
        });

        res.status(200).json({ message: 'Email sent: ' + info.response });
    });
});

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Маршруты для API поиска в коллекциях
const getProduct = async (model, artikul, res) => {
    try {
        const sanitizedArtikul = sanitizeInput(artikul);
        const product = await model.findOne({ artikul: sanitizedArtikul });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

app.get('/api/gerbStuff/:artikul', (req, res) => {
    getProduct(GerbStuff, req.params.artikul, res);
});

app.get('/api/tablesSizes/:artikul', (req, res) => {
    getProduct(TablesSizes, req.params.artikul, res);
});

app.get('/api/osnastki/:artikul', (req, res) => {
    getProduct(Osnastki, req.params.artikul, res);
});

// Обработка всех остальных маршрутов, возвращая index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'cart-js', 'build', 'index.html'));
});

// Обработка ошибок
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});