# How to contribute ?

#### ➕ Creating a new widget

> When creating a new widget, please follow the following guidelines:

1. Structure the widget as follows:

```
/lib/
  -> components/
    -> X/
      -> new-widget/
        -> loaders/
        -> New-Widget-Widget.svelte
          Is the MAIN entry point to the widget that is being created, think of it as the *handler*
          for the widget, containing "data" getter for the widget, and showing loaders.
        -> New-Widget-Main.svelte
          Is the MAIN widget layout, design and logic, after the parent [...]-Widget.svelte has loaded all necessary
          data and deemed it OK to show the widget.
        -> New-Widget-Loader.svelte
          Is the MAIN widget loader layout, used for showing the widget outline and it's preloading-state. Used in
          conjuction with the .svelte files in the laoders/ folder, containing .svg elements within.
```

⚠️ Take a look at the `src/lib/components/page/player/team` as an example.