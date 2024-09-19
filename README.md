# E-Ticaret Sitesi

Bu proje bir e-ticaret sitesi uygulamasıdır ve hem yerel (localhost) hem de Firebase üzerinde çalıştırılmak üzere tasarlanmıştır.

## Projeyi Başlatmak

### 1. Yerel Ortam (Localhost) Üzerinde Çalıştırma

Bunun için öncelikle src localhost klasörünü zipden çıkarmanız gerekiyor 

#### Gereksinimler

- Node.js (v14 veya üzeri)
- MySQL (Veritabanı için)
- npm veya yarn (Paket yönetimi için)

#### Adımlar

1. **Depoyu Kopyala:**

   ```bash
   git clone <repository-url>
   cd e-ticaret-sitesi
   ```
2. **Bağımlılıkları Yükleyin:**

```bash
npm install
```	
3.**Veritabanını Kurun:**

MySQL kullanarak bir veritabanı oluşturun ve yapılandırma dosyanıza (örneğin .env) veritabanı bilgilerinizi ekleyin.

.env dosyasını oluşturun:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=eticaret
```
4.**API Sunucusunu Başlatın:**

API sunucusu localhost:3001 portunda çalışacaktır.
```
npm run server
React Uygulamasını Başlatın:
```
Uygulama ana frontend kısmını çalıştırmak için:

npm start
Tarayıcıda Uygulamayı Açın:

Uygulamanın yerel sürümünü görmek için tarayıcınızda şu adrese gidin:

http://localhost:3000


### 2. Firebase Üzerinde Yayınlama
Gereksinimler
Firebase CLI
Firebase hesabı
Firebase'e Yayınlama Adımları
Firebase CLI'yi Kurun:

1.**Firebase CLI'yi global olarak yükleyin:**
```
npm install -g firebase-tools
```
2.**Firebase'e Giriş Yapın:**


Firebase hesabınıza giriş yapmak için:
```
firebase login
```
3.**Firebase Projesini Başlatın:**
	
Firebase projesini oluşturmak veya mevcut bir projeyi kullanmak için:

firebase init
Hosting ve Firestore gibi seçenekleri seçin.
build klasörünüzün Firebase hosting olarak ayarlanmasını sağlayın.

4.**Build İşlemi:**

React uygulamasını üretim ortamı için derleyin:

npm run build

5.**Firebase'e Yayınlama:**

Firebase'e projenizi şu komut ile gönderin:

firebase deploy
Firebase üzerinde barındırılan uygulamaya erişmek için Firebase'den aldığınız domain adresini kullanabilirsiniz.

### Özellikler
Ürün listeleme
Sepete ürün ekleme ve silme
Ürün detay sayfası
Kullanıcı girişi ve kaydı (JWT ile)
Admin paneli (Ürün yönetimi için)
Teknolojiler
React
Redux
MySQL
Firebase Hosting
Node.js (API)


Bu README dosyası, projenizin hem yerel olarak hem de Firebase'de nasıl çalıştırılacağını ve yapılandırılacağını adım adım açıklıyor. Eğer eklemek istediğiniz özel bilgiler veya projeye dair başka gereksinimler varsa onları da dahil edebiliriz.
