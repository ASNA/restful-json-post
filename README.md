## Consume a Web API from the server side

RESTful APIs are very often consumed client, in a browser, with JavaScript. However, some applications have the need to reach out and read a RESTful API from the server side, usually from a batch program. This console application example shows a way to do that. 

To run this example you need to have a copy of the [avr-restful-api-with-tabulator](https://github.com/ASNA/avr-restful-api-with-tabulator) running locally. When you run that app, its first screen shows a list of customers in a JavaScript-based grid. This grid was populated with a RESTful service call. Your port number will vary, but for this example, we'll assume the port is 3312. With this example running, you could be able to enter 

    localhost:3312/api/customers 
    
to see the raw Json response from the RESTful service, as shown below in Figure 1.

![](https://asna.com/filebin/marketing/article-figures/json-in-browser.png)

<small>Figure 1. RESTful service Json payload in a browser.</small>

The challenge, though, is to process this Json payload on the server side, not in the browser client. The cod in Figure 2 shows how to do that. Its usage is: 

    ConsumeJsonService <url>

so in this case, we'll call it like this: 

    ConsumeJsonServerSide http:3312/api/customers 

The `Run` method calls the `SubmitGetRequest` method to fetch the Json response. `SubmitGetRequest`
returns the Json response as a string. The [Json.NET library](https://www.newtonsoft.com/json), as explained in this [ASNA article](https://asna.com/us/articles/newsletter/2016/q3/read-write-json) is used to convert this string to its underlying object&mdash;which is in this case is a collection of `CustomerEntity` class instances.

From this point you could do anything you need with this strongly-typed data. In this example, the  collection is iterated ver to show each customer's name in the collection. 

    Using System
    Using System.Text
    Using System.Collections.Generic 
    Using System.Web
    Using System.IO 
    Using System.Net 
    
    BegClass Program
        BegSr Main Shared(*Yes) Access(*Public) Attributes(System.STAThread())
            DclSrParm args Type(*String) Rank(1)
    
            DclFld tc Type(TestClasses) New() 
    
            tc.Run(args[0]) 
    
            Console.WriteLine('Press any key to continue...') 
            Console.ReadKey()
        EndSr
    EndClass
    
    BegClass TestClasses
    
        BegSr Run Access(*Public) 
            DclSrParm Url Type(String) 
            DclFld ResponseString Type(*String) 
            
            DclFld CustomerList Type(List(*Of CustomerEntity))
            DclArray CustomerArray Type(CustomerEntity) Rank(1) 
    
            ResponseString = SubmitGetRequest(Url) 
            CustomerList = NewtonSoft.Json.JsonConvert.DeserializeObject(ResponseString, *TypeOf(List(*Of CustomerEntity))) *As List(*Of CustomerEntity)
    
            // It's not used here, but an array is generally a better object to pass around that a List<T>. This is 
            // what it takes to convert the List<CustomerEntity> to an array of CustomerEntities. 
            CustomerArray = CustomerList.ToArray()      
    
            Console.Clear()
            Console.WriteLine('Read {0} customers from the Web API', CustomerList.Count) 
            Console.WriteLine("Press any key to show each customer name...") 
            Console.ReadKey()
    
            ForEach ce Type(CustomerEntity) Collection(CustomerList) 
                Console.WriteLine(ce.CMName) 
            EndFor
                    
        EndSr
    
        BegFunc SubmitGetRequest Type(*String) 
            DclSrParm Url      Type(*String) 
            
            DclFld encoding        Type(ASCIIEncoding) New()
            DclFld myRequest       Type(HttpWebRequest) 
            DclFld myResponse      Type(HttpWebResponse) 
            DclFld requestStream   Type(Stream) 
            DclFld responseStream  Type(Stream) 
            DclFld responseString  Type(*String) 
            DclFld sr              Type(StreamReader) 
           
            myRequest = WebRequest.Create(Url) *As HttpWebRequest         
            myRequest.Method = "GET"
    
            Try 
                // Send the request to the server.
                requestStream = myRequest.GetRequestStream()
                requestStream.Close()
            Catch error Type(System.Exception)
                // Handle exception error here.
            EndTry
            
            // Fetch response from server as a string.
            myResponse = myRequest.GetResponse() *As HttpWebResponse
            If (myResponse.StatusCode = HttpStatusCode.OK)
                responseStream = myResponse.GetResponseStream()
                sr = *New StreamReader(responseStream) 
                responseString = sr.ReadToEnd() 
                sr.Close()
            Else 
                // Handle HttpStatusCode not OK here.            
            EndIf
            
            LeaveSr responseString 
        EndFunc                 
    
    EndClass