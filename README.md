UX Rocket Modal
==============
Modal plugini, jQuery Colorbox üzerine geliştirilmiştir. Orjinal plugindeki özelliklerin tamamı kullanılabilir.
Ayrıca, modal pencere açacak bağlantılara `data` tanımları ile de ayarları değiştirilebilir. Colorbox kullanımı ile alakalı detayları [buradan](http://www.jacklmoore.com/colorbox/) inceleyebilirsiniz.

```HTML
<p>Başka bir <a href="http://github.com/uxrocket" class="modal">sayfaya</a> ajax</p>

<p><a href="http://player.vimeo.com/video/2285902" class="modal" data-iframe="true" data-inner-width="500" data-inner-height="409">Flash/Video gösterimi</a> (iframe ile vimeo videosu)</p>

<p>Başka bir <a href="http://www.google.com" class="modal" data-iframe="true" data-width="80%" data-height="80%">sayfaya</a> iframe</p>

<p>Sayfa içindeki <a href="#hidden-content" class="modal" data-inline="true">gizli bir içerik</a> gösterimi.</p>

<p>Callback <a href="http://www.google.com" class="modal" data-iframe="true" data-on-ready="onReady()" data-on-open="onOpen()" data-on-load="onLoad()" data-on-complete="onComplete()" data-on-cleanup="onCleanup"
data-on-closed="onClosed()">örnekleri</a> (console'da tetiklenen callbackleri görebilirsiniz).</p>
```

```JavaScript
var onReady = function(){
	console.log("onReady: Modal plugini elemana bind oldu");
}

var onOpen = function(){
    console.log("onOpen: Modal plugini, pencereyi açıyor.");
}

var onLoad = function(){
    console.log("onLoad: Modal plugini, içeriği yükledi");
}

var onComplete = function(){
    console.log("onComplete: Modal plugini, pencere açılışını ve yüklemeyi tamamladı");
}

var onCleanup = function(){
    console.log("onCleanup: Modal plugini kapanmaya hazırlandı");
}

var onClosed = function(){
    console.log("onClosed: Modal plugini kapandı");
}
```

### Notlar

Ajax formatında ya da inline açılan içeriklerde pencere genişliği yüklenen içeriğin genişliğine göre otomatik olarak
belirlenir. Dilenirse, genişlik/yükseklik tanımı ayrıca yapılabilir.

iFrame formatında açılacak içerikler de ise, yükseklik ve genişlik tanımı yapılmalıdır.

Callback tanımlarında, `onReady` callbacki uxitd-modal plugini tarafından çalıştırılmaktadır. Diğer callbackler
ise Colorbox eventlerine göre Colorbox içinden çalışmaktadır.


### Tanımlar
Property			 | Default			| Açıklama
-------------------- | ---------------- | --------
iframe               | false            | Pencere içerisine yüklenecek içeriğin iFrame olarak yüklenmesini sağlar.
inline               | false            | Pencere içerisine yüklenecek içeriğin sayfa içerisinde bulunan bir eleman olmasını sağlar. Bu içerik bir seçici de olabilir. Bir jQuery objesi de olabilir. <br />`// Using a selector:`<br />`$("#inline").modal({inline:true, href:"#myForm"});` <br /><br />`// Using a jQuery object:`<br />`var $form = $("#myForm");`<br />`$("#inline").modal({inline:true, href:$form});`
html                 | false            | Herhangibir yerden çekilecek içerik yerine, doğrudan modal içerisinde gösterilecek bir html ya da text içerik tanımlamanızı sağlar. <br />`$.uxmodal({html:"Hello"});`
ajax                 |                  | Başka bir tanım yapılmadığı durumda, pencere içerisine içerikler Ajax ile yüklenir.
href                 | false            | Açılacak içeriğin URL adresi. `modal` ile tanımlanmış linkin href attributeündeki URL adresi kullanılmaktadır.
width                | null              | Açılan içerik penceresi için ön tanımlı genişlik. Pixel ya da % cinsinden tanımlanabilir.
height               | null              | Açılan içerik penceresi için ön tanımlı yüksekli. Pixel ya da % cinsinden tanımlanabilir.
innerWidth           | false            | 'width' tanımı için alternatif kullanımdır. Modal içindeki border ve buton genişliklerini hesaplamadan sadece yüklenen içerik kısmının genişliğini belirler.
innerHeight          | false            | 'height' tanımı için alternatif kullanımdır. Modal içindeki border ve buton genişliklerini hesaplamadan sadece yüklenen içerik kısmının genişliğini belirler.
maxWidth             | false            | Yüklenen içeriğin kendi genişliğinden bağımsız olarak, modal penceresinin maksimum genişliğini belirler.
maxHeight            | false            | Yüklenen içeriğin kendi yüksekliğinden bağımsız olarak, modal penceresinin maksimum yüksekliğini belirler.
openOnload           | false            | Sayfa yüklenir yüklenmez, içeriğin modal penceresinde açılmasını sağlar. Sonrasında ilgili elemana tıklayarak tekrar açılmasına imkan verir.

Data Attribute			   | &nbsp;
-------------------------- | -----
iframe                     | Pencere içerisine yüklenecek içeriğin iFrame olarak yüklenmesini sağlar.
inline                     | Pencere içerisine yüklenecek inline bir elemanın `id`, `class`'ı ya da `etiketi` ni belirtir.
html                       | İçerik olarak gösterilecek HTML ya da Text formatlı metni belirtir.
width                      | Açılan içerik penceresi için ön tanımlı genişlik. Pixel ya da % cinsinden tanımlanabilir.
height                     | Açılan içerik penceresi için ön tanımlı yüksekli. Pixel ya da % cinsinden tanımlanabilir.
inner-width                | 'width' tanımı için alternatif kullanımdır. Modal içindeki border ve buton genişliklerini hesaplamadan sadece yüklenen içerik kısmının genişliğini belirler.
inner-height               | 'height' tanımı için alternatif kullanımdır. Modal içindeki border ve buton genişliklerini hesaplamadan sadece yüklenen içerik kısmının genişliğini belirler.
max-width                  | Yüklenen içeriğin kendi genişliğinden bağımsız olarak, modal penceresinin maksimum genişliğini belirler.
max-height                 | Yüklenen içeriğin kendi yüksekliğinden bağımsız olarak, modal penceresinin maksimum yüksekliğini
open-onload                | Sayfa yüklenir yüklenmez, içeriğin modal penceresinde açılmasını sağlar. Sonrasında ilgili elemana tıklayarak tekrar açılmasına imkan verir.


Callback			 | &nbsp;
-------------------- | -----
onReady              | Modal plugini elemana bağlandığında çalışacak fonksiyonu çağırır.
onOpen               | Linke tıklandığında, modal açılmadan önce çalışacak fonksiyonu çağırır.
onLoad               | Modal açıldığında, içine gösterilecek içerik yüklenmeye başlandığında çalışacak fonksiyonu çağırır.
onComplete           | Modal penceresine gösterilecek içerik yüklendikten sonra çalışacak fonksiyonu çağırır.
onCleanup            | Modal penceresi kapanmadan önce çalışacak fonksiyonu çağırır.
onClosed             | Modal penceresi kapandıktan sonra çalışacak fonksiyonu çağırır.


### Public Metodlar
Method					  | Açıklama
------------------------- | -------------------------------------------------------
$(selector).modal(options)| Bu method plugini manuel olarak bir elemana bağlamanızı sağlar.
$.uxmodal                 | Bu method pluginin detayını görmenizi sağlar
$.uxmodal.version         | Sayfaya eklenmiş pluginin versiyon numarasını gösterir.
$.uxmodal.settings        | Aktif pluginin ayarlarını gösterir.
$.uxmodal.close()         | Modal penceresini kapatır.
$.uxmodal.resize()        | Modal penceresini tekrar boyutlandırır.
$.uxmodal.remove()        | Modal penceresini sayfadan kaldırır. Bu metod çağrıldıktan sonra, modal penceresinin çalışması iptal edilmiş olur.
