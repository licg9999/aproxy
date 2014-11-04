#structurejs

A solution to structure js codes in one file.

## example

<pre>
&lt;javascript src="build/structure.js"&gt;&lt;/script&gt;
...
structure([
  /* structured codes */
  function(ths, cfg){
    console.log(cfg.greeting); // 'hello world'
  }
], {
  /* configuration */
  greeting: 'hello world'
});
</pre>
