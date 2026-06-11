//-----------------------#1-------------------------------

/**
 * 二つの数の最大公約数を返します
 * @param {number} n1 整数
 * @param {number} n2 整数
 * @returns int
 */
function gcd(n1, n2)
{
    if (n1 % n2 == 0)
    {
        return n2;
    }
    else
    {
        return gcd(n2, n1 % n2);
    }
}

//-----------------------#2-------------------------------

/**
 * 素な数に関するクラス
 * @param {number} n 自然数
 */
class prime
{
    constructor(n)
    {
        this.primelist = prime.primenumberlist(n);
        this.theprime = prime.theprimenumber(n);
        this.coprimelist = prime.coprimenumberlist(n);
    }
    
    /**
     * n以下の素数を返します
     * @param {number} n 自然数
     * @returns array
     */
    static primenumberlist(n)
    {
        let prime_list = [2, 3];
        let n_list = Array.from({length: Math.floor((n - 5) / 2) + 1}, (_, x) => 5 + x * 2).filter(num => num % 3 != 0);
        
        for (let i = 0; i < n; i++)
        {
            if (prime_list[prime_list.length - 1] ** 2 >= n)
            {
                prime_list = prime_list.concat(n_list);
                break;
            }
            else
            {
                prime_list.push(n_list[0]);
                n_list = n_list.filter(num => num % prime_list[prime_list.length - 1] != 0);
            }
            if (n_list.length == 0)
            {
                break;
            }
        }
        return prime_list;
    }

    /**
     * n番目の素数を返します
     * @param {number} n 自然数
     * @returns int
     */
    static theprimenumber(n)
    {
        let prime_list = [2, 3];
        let i = 1;
        while (prime_list.length < n)
        {
            for (let j = 0; j < 2; j++)
            {
                let check = true;
                for (let s of prime_list)
                {
                    if ((6 * i + (-1) ** (j + 1)) % s == 0)
                    {
                        check = false;
                        break;
                    }
                    if (s ** 2 >= 6 * i + (-1) ** (j + 1))
                    {
                        break;
                    }
                }
                if (check)
                {
                    prime_list.push(6 * i + (-1) ** (j + 1));
                }
            }
            i++;
        }
        return prime_list[n - 1];
    }

    /**
     * n以下のnと互いに素な数を返します
     * @param {number} n 自然数
     * @returns array
     */
    static coprimenumberlist(n)
    {
        let coprime_list = [1];
        for (let i = 2; i < n; i++)
        {
            if (gcd(n, i) == 1)
            {
                coprime_list.push(i);
            }
        }
        return coprime_list;
    }

    /**
     * nを素因数分解します
     * @param {number} n 自然数
     * @returns array
     */
    static primefactorization(n)
    {
        let primefac = [];
        let m = n;
        for (let i = 2; i < n + 1; i++)
        {
            while (m % i == 0)
            {
                primefac.push(i);
                m /= i;
            }
            if (m == 1)
            {
                break;
            }
        }
        return primefac;
    }

    /**
     * n が素数かを判定します
     * @param {number} n 自然数
     * @returns bool
     */
    static isprime(n)
    {
        let i = 1;
        for (let j = 2; j < 4; j++)
        {
            if (n % j == 0)
            {
                return false;
            }
        }

        while (true)
        {
            for (j = 1; j < 3; j++)
            {
                let nearprime = 6 * i + Math.pow(-1, j);
                if (Math.pow(nearprime, 2) > n)
                {
                    return true;
                }
                else if (n % nearprime == 0)
                {
                    return false;
                }
            }
        }
    }
}

//-----------------------#3-------------------------------

/**
 * 線形合同法 (Linear congruential generators) による乱数を生成します
 */
class LCG
{
    #seed;
    #a;
    #c;
    #m;
    #x = 0;
    #start;

    /**
     * start 以上 end 未満の乱数を生成します
     * @param {number} start 自然数
     * @param {number} end 自然数
     */
    constructor(start, end)
    {
        if (start >= end)
        {
            //　start が end 以上の場合、計算で起こる無限ループ回避のため初期設定をしない
            console.log("randomliner : start < end");
        }
        else
        {
            //　初期設定をする
            //　a, c, m, seed の値を取得
            this.#start = start;
            this.#m = end;
            [this.#a, this.#c] = this.#find_a_c();
            this.#seed = Date.now() % end;
        }
    }

    /**
     * a と c の値を求めます
     * @returns array
     */
    #find_a_c()
    {
        //　a-1 の値を求める
        let a = 4;
        let j = 0;
        prime.primefactorization(this.#m).forEach(i =>
        {
            if (j != i)
            {
                a *= i;
                j = i;
            }
        });
        a += 1;

        //　c の値を求める
        let coli = prime.coprimenumberlist(this.#m);
        let c = coli[Math.floor(coli.length / 2)];
        return [a, c];
    }

    /**
     * 生成した乱数を返します
     * @returns int
     */
    random()
    {
        //　乱数を生成、生成した値が start 未満または seed が 1以上なら再生成
        this.#x = (this.#a * this.#x + this.#c) % this.#m;
        while (this.#seed > 0 || this.#start > this.#x)
        {
            this.#x = (this.#a * this.#x + this.#c) % this.#m;
            this.#seed -= 1;
        }
        return this.#x;
    }
}

/**
 * LCGを改良した乱数を生成します
 */
class ReLCG
{
    #seed;
    #a;
    #c;
    #m = 10000;
    #x = 0;
    #start;
    #end; //　追加

    /**
     * start 以上 end 未満の乱数を生成します
     * @param {number} start 自然数
     * @param {number} end 自然数
     */
    constructor(start, end)
    {
        if (start >= end)
        {
            //　start が end 以上の場合、計算で起こる無限ループ回避のため初期設定をしない
            console.log("randomliner : start < end");
        }
        else
        {
            //　初期設定をする
            //　a, c, m, seed の値を取得
            this.#start = start;
            this.#end = end; //　追加
            if (this.#m < end) //　追加
            {
                this.#m = end;
            }
            [this.#a, this.#c] = this.#find_a_c();
            this.#seed = Date.now() % this.#m;
        }
    }

    /**
     * a と c の値を求めます
     * @returns array
     */
    #find_a_c()
    {
        //　a-1 の値を求める
        let a = 4;
        let j = 0;
        prime.primefactorization(this.#m).forEach(i =>
        {
            if (j != i)
            {
                a *= i;
                j = i;
            }
        });
        a += 1;

        //　c の値を求める
        let coli = prime.coprimenumberlist(this.#m);
        let c = coli[Math.floor(coli.length / 2)];
        return [a, c];
    }

    /**
     * 生成した乱数を返します
     * @returns int
     */
    random()
    {
        //　乱数を生成、生成した値が start 未満または seed が 1以上なら再生成
        this.#x = (this.#a * this.#x + this.#c) % this.#m;
        let generated = this.#x * (this.#end - this.#start) / this.#m + this.#start; //　追加
        while (this.#seed > 0 || generated < this.#start) //　一部変更
        {
            this.#x = (this.#a * this.#x + this.#c) % this.#m;
            this.#seed -= 1;
            generated = this.#x * (this.#end - this.#start) / this.#m + this.#start; //　追加
        }
        return Math.floor(generated); //　変更
    }
}

window.ReLCG = ReLCG;
