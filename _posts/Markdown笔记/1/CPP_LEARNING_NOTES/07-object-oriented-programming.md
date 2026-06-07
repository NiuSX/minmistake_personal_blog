# 07. 面向对象编程

## 类与对象

类是类型，对象是类型的实例：

```cpp
class User {
public:
    std::string name;
    int age{};
};

User user{"Alice", 20};
```

## 访问控制

```cpp
class Account {
public:
    void deposit(double amount) {
        balance_ += amount;
    }

    double balance() const {
        return balance_;
    }

private:
    double balance_{};
};
```

- `public`：外部可访问。
- `private`：类内部可访问。
- `protected`：类内部和派生类可访问。

数据成员通常设为 private，通过成员函数控制访问。

## 构造函数

```cpp
class User {
public:
    User(std::string name, int age)
        : name_{std::move(name)}, age_{age} {}

private:
    std::string name_;
    int age_{};
};
```

推荐使用成员初始化列表，而不是在构造函数体中赋值。

## 默认成员初始化

```cpp
class Config {
private:
    int timeout_seconds_{30};
    bool debug_{false};
};
```

这样能保证对象默认状态有效。

## const 成员函数

```cpp
class User {
public:
    const std::string& name() const {
        return name_;
    }

private:
    std::string name_;
};
```

`const` 成员函数承诺不修改对象的可观察状态。

## this 指针

成员函数内部可以使用 `this` 指向当前对象：

```cpp
class Counter {
public:
    Counter& increment() {
        ++value_;
        return *this;
    }

private:
    int value_{};
};
```

返回 `*this` 可实现链式调用。

## static 成员

```cpp
class Counter {
public:
    static int count;
};

int Counter::count = 0;
```

C++17 起可使用 inline static：

```cpp
class Counter {
public:
    inline static int count = 0;
};
```

## 继承

```cpp
class Animal {
public:
    void eat() {}
};

class Dog : public Animal {
public:
    void bark() {}
};
```

继承表示 is-a 关系。不要为了复用代码滥用继承，组合通常更灵活。

## 虚函数与多态

```cpp
class Shape {
public:
    virtual ~Shape() = default;
    virtual double area() const = 0;
};

class Circle : public Shape {
public:
    explicit Circle(double radius) : radius_{radius} {}

    double area() const override {
        return 3.1415926 * radius_ * radius_;
    }

private:
    double radius_{};
};
```

通过基类指针调用派生类实现：

```cpp
std::unique_ptr<Shape> shape = std::make_unique<Circle>(2.0);
std::cout << shape->area() << '\n';
```

基类析构函数应为 virtual，避免通过基类指针删除派生对象时行为错误。

## override 与 final

```cpp
class Circle final : public Shape {
public:
    double area() const override {
        return 0;
    }
};
```

- `override` 表示重写虚函数，能让编译器检查签名。
- `final` 表示不能再被继承或重写。

## 抽象类

含有纯虚函数的类是抽象类：

```cpp
class Repository {
public:
    virtual ~Repository() = default;
    virtual std::string find_by_id(int id) = 0;
};
```

抽象类常用于接口。

## 组合优先于继承

组合：

```cpp
class Car {
private:
    Engine engine_;
};
```

如果关系是 has-a，优先用组合。如果关系是明确的 is-a，才考虑继承。

## 运算符重载

```cpp
class Point {
public:
    Point(int x, int y) : x_{x}, y_{y} {}

    Point operator+(const Point& other) const {
        return Point{x_ + other.x_, y_ + other.y_};
    }

private:
    int x_{};
    int y_{};
};
```

运算符重载应符合直觉，不要让 `+` 执行删除、保存等副作用操作。

## 类设计建议

- 保持对象始终处于有效状态。
- 隐藏数据，暴露行为。
- 构造函数完成必要初始化。
- 接口要小而明确。
- 用组合替代不必要的继承。
- 多态基类需要 virtual 析构函数。
- 重写虚函数时使用 `override`。

## 本章检查清单

- 是否知道 public、private、protected 的区别？
- 是否理解构造函数初始化列表？
- 是否知道 const 成员函数的意义？
- 是否知道多态需要 virtual？
- 是否知道组合优先于继承？

