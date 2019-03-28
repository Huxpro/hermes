// RUN: %hermes -O -fno-calln -commonjs -dump-bytecode %s | %FileCheck --match-full-lines %s

var x = encodeURIComponent('asdf');
function foo() {
  // Need to ensure that foo retains the ability to run,
  // and doesn't have an UnreachableInst inside it.
  return x;
}

try {
  // The try-catch is here to ensure foo isn't inlined here.
  foo();
} catch (e) {}

foo();

// CHECK: Global String Table:
// CHECK-NEXT:   s0[ASCII, {{.*}}]: asdf
// CHECK-NEXT:   s1[ASCII, {{.*}}]: foo
// CHECK-NEXT:   s2[ASCII, {{.*}}]: cjs_module
// CHECK-NEXT:   i3[ASCII, {{.*}}] #{{[0-9A-Z]+}}: encodeURIComponent
// CHECK-NEXT:   s4[ASCII, {{.*}}]: global
// CHECK-NEXT:   s5[ASCII, {{.*}}]: cjs-dce.js

// CHECK: CommonJS Modules:
// CHECK-NEXT:   File ID 5 -> function ID 1

// CHECK: Function<global>(1 params, 1 registers, 0 symbols):
// CHECK-NEXT:     LoadConstUndefined r0
// CHECK-NEXT:     Ret               r0

//CHECK:Function<cjs_module>(4 params, 13 registers, 1 symbols):
//CHECK-NEXT:Offset in debug table: {{.*}}
//CHECK-NEXT:    CreateEnvironment r3
//CHECK-NEXT:    CreateClosure     r1, r3, 2
//CHECK-NEXT:    GetGlobalObject   r0
//CHECK-NEXT:    TryGetById        r4, r0, 1, "encodeURIComponen"...
//CHECK-NEXT:    LoadConstUndefined r0
//CHECK-NEXT:    LoadConstString   r5, "asdf"
//CHECK-NEXT:    LoadConstUndefined r6
//CHECK-NEXT:    Call              r2, r4, 2
//CHECK-NEXT:    StoreToEnvironment r3, 0, r2
//CHECK-NEXT:    Mov               r2, r1
//CHECK-NEXT:    LoadConstUndefined r6
//CHECK-NEXT:    Call              r2, r2, 1
//CHECK-NEXT:    Jmp               L1
//CHECK-NEXT:    Catch             r2
//CHECK-NEXT:L1:
//CHECK-NEXT:    LoadConstUndefined r6
//CHECK-NEXT:    Call              r1, r1, 1
//CHECK-NEXT:    Ret               r0

// CHECK: Exception Handlers:
// CHECK-NEXT: 0: start = {{.*}}

// CHECK: Function<foo>(1 params, 1 registers, 0 symbols):
// CHECK-NEXT:     GetEnvironment    r0, 0
// CHECK-NEXT:     LoadFromEnvironment r0, r0, 0
// CHECK-NEXT:     Ret               r0
