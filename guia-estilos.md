# Guía de estilos BEM

## ¿Cómo funciona BEM?
BEM es una convención o metodología para nombrar tus clases de CSS. Por sus siglas en inglés, BEM significa Bloque, Elemento y Modificador. Sigue esta guía para mantener una organización efectiva en tus estilos CSS utilizando BEM.

BEM funciona identificando el bloque, el elemento y el modificador de un componente.

* Bloque es el contenedor principal del componente: card, button, form, menu, header…
* Elemento son las partes internas que conforman el componente: con, text, item, image, input, button…
* Modificador son las variaciones del bloque o del elemento: active, big, right, secondary, red…

## Cómo se usar BEM en CSS

Los nombres de clases con convención BEM,pueden tener la siguiente sintaxis:

* .bloque: `.button`
* .bloque__elemento: `.button__text`
* .bloque--modificador: `.button--active`
* .elemento--modificador: `.text--red`
* .bloque__elemento--modificador: `.form__input--active`

## Ejemplos de uso de BEM
Así se vería el HTML:
```html
<!-- Bloque: .button -->
<button class="button button--primary">
    <!-- Elemento: .button__text -->
    <span class="button__text">Click me</span>
    <!-- Elemento: .button__icon -->
    <i class="button__icon fa fa-arrow-right"></i>
</button>
```
Y así en CSS:
```css
// Estilos del bloque
.button {
    padding: 10px 20px;
    border: 1px solid transparent;
    border-radius: 5px;
    cursor: pointer;
    
    // Modificador: .button--primary
    &--primary {
        background-color: #007bff;
        color: #fff;
        
        // Estilos específicos del botón primario
    }
    
    // Estilos comunes a todos los botones
}

// Estilos del elemento .button__text
.button__text {
    font-size: 16px;
    font-weight: bold;
}

// Estilos del elemento .button__icon
.button__icon {
    margin-left: 5px;
    font-size: 14px;
}
```

⚠️ Importante: recuerda que:
* Los guiones bajos (__) se usan para separar el bloque del elemento,
* Los guiones medios (--) se usan para separar el bloque o el elemento del modificador.

## Casos prácticos de uso
![image](https://github.com/Gab-Serrano/govegan-frontend/assets/101837552/b80956fb-9b52-4ae7-a017-cfdb4ae44069)
De la imagen anterior, tenemos lo siguiente:
* Bloque: navbar
* Elementos: logo, items
* Modificadores: gray

Su estructura de HTML con la convención de clases BEM, sería:
```html
<nav class="navbar">
    <ul class="navbar__list">
        <li class="navbar__item">
            <a href="#" class="navbar__link">
                <i class="navbar__icon"></i>
                MEN
            </a>
        </li>
        <li class="navbar__item">
            <a href="#" class="navbar__link">WOMEN</a>
        </li>
        <li class="navbar__item">
            <a href="#" class="navbar__link">KIDS</a>
        </li>
        <li class="navbar__item">
            <a href="#" class="navbar__link">ACCESSORIES</a>
        </li>
        <li class="navbar__item">
            <a href="#" class="navbar__link">PREMIUM</a>
        </li>
        <li class="navbar__item navbar__item--gray">
            <a href="#" class="navbar__link">ACCOUNT</a>
        </li>
        <li class="navbar__item navbar__item--gray">
            <a href="#" class="navbar__link">SEARCH</a>
        </li>
        <li class="navbar__item">
            <a href="#" class="navbar__link">CART (0)</a>
        </li>
    </ul>
</nav>
```

Y su CSS
```css
/* Estilos del bloque navbar */
.navbar {
    background-color: #333;
    padding: 10px;
}

/* Estilos de la lista navbar__list */
.navbar__list {
    list-style: none;
    margin: 0;
    padding: 0;
}

/* Estilos de los ítems navbar__item */
.navbar__item {
    display: inline-block;
    margin-right: 10px;
}

/* Estilos de los enlaces navbar__link */
.navbar__link {
    color: #fff;
    text-decoration: none;
    padding: 5px 10px;
}

/* Estilos del ícono navbar__icon */
.navbar__icon {
    margin-right: 5px;
}

/* Estilos del ítem navbar__item--gray */
.navbar__item--gray .navbar__link {
    color: #999;
}

/* Estilos cuando se hace hover sobre los enlaces */
.navbar__link:hover {
    background-color: #555;
}

/* Modificador para cambiar el color de fondo del navbar */
.navbar--dark {
    background-color: #222;
}

/* Modificador para hacer los enlaces más grandes */
.navbar__link--large {
    font-size: 18px;
}
```

## Estructura de carpetas sugerida
Dentro de esta carpeta, crea subcarpetas para cada componente de tu aplicación. Cada subcarpeta debe contener al menos un archivo .scss que contenga los estilos para ese componente.
```
styles/
├── components/
│   ├── block/
│   │   ├── _block.scss
│   │   ├── _block__element.scss
│   │   └── _block--modifier.scss
│   ├── button/
│   │   ├── _button.scss
│   │   ├── _button__icon.scss
│   │   └── _button--large.scss
│   ├── card/
│   │   ├── _card.scss
│   │   ├── _card__title.scss
│   │   └── _card--highlighted.scss
│   └── ...
├── base/
│   └── ...
├── layout/
│   └── ...
└── ...
```
## Bibliografía
* [Guía de BEM para CSS](https://platzi.com/blog/bem/)
